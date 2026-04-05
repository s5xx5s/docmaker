import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Project, Guide, Section } from '../types';
import { generateId } from '../utils/id';
import { demoProject, DEMO_SEEDED_KEY_V2 } from '../data/demoProject';
import { idbStorage } from '../utils/idb-storage';
import LZString from 'lz-string';

interface ProjectStore {
  /** True once the IDB read has completed on startup. */
  _hydrated: boolean;

  projects: Project[];
  activeProjectId: string | null;
  activeGuideId: string | null;

  // Projects CRUD
  addProject(name: string, description?: string): Project;
  updateProject(id: string, patch: Partial<Pick<Project, 'name' | 'description'>>): void;
  deleteProject(id: string): void;
  duplicateProject(id: string): Project;
  importProject(project: Project): void;

  // Guides CRUD
  addGuide(projectId: string, title: string): Guide;
  updateGuide(projectId: string, guideId: string, patch: Partial<Omit<Guide, 'id' | 'projectId'>>): void;
  deleteGuide(projectId: string, guideId: string): void;

  // Sections
  addSection(projectId: string, guideId: string, title: string): Section;

  // Navigation
  setActiveProject(id: string | null): void;
  setActiveGuide(id: string | null): void;
}

const now = () => new Date().toISOString();

function makeGuide(projectId: string, title: string): Guide {
  return {
    id: generateId(),
    projectId,
    title,
    themeId: 'dark-navy',
    defaultLang: 'en',
    availableLangs: [{ code: 'en', name: 'English', dir: 'ltr', flag: '🇺🇸' }],
    sections: [],
    isPublished: false,
    createdAt: now(),
    updatedAt: now(),
  };
}

function makeSection(title: string): Section {
  return {
    id: generateId(),
    title,
    order: 0,
    isActive: true,
    blocks: [],
    translations: {},
  };
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      _hydrated: false,
      projects: [],
      activeProjectId: null,
      activeGuideId: null,

      addProject(name, description) {
        const project: Project = {
          id: generateId(),
          name,
          description,
          createdAt: now(),
          updatedAt: now(),
          guides: [],
        };
        set((s) => ({ projects: [...s.projects, project] }));
        return project;
      },

      updateProject(id, patch) {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, ...patch, updatedAt: now() } : p
          ),
        }));
      },

      deleteProject(id) {
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          activeProjectId: s.activeProjectId === id ? null : s.activeProjectId,
        }));
      },

      duplicateProject(id) {
        const original = get().projects.find((p) => p.id === id);
        if (!original) throw new Error('Project not found');
        const copy: Project = {
          ...JSON.parse(JSON.stringify(original)) as Project,
          id: generateId(),
          name: `${original.name} (copy)`,
          createdAt: now(),
          updatedAt: now(),
        };
        set((s) => ({ projects: [...s.projects, copy] }));
        return copy;
      },

      importProject(project) {
        const withNewId: Project = { ...project, id: generateId(), updatedAt: now() };
        set((s) => ({ projects: [...s.projects, withNewId] }));
      },

      addGuide(projectId, title) {
        const guide = makeGuide(projectId, title);
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? { ...p, guides: [...p.guides, guide], updatedAt: now() }
              : p
          ),
        }));
        return guide;
      },

      updateGuide(projectId, guideId, patch) {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  updatedAt: now(),
                  guides: p.guides.map((g) =>
                    g.id === guideId ? { ...g, ...patch, updatedAt: now() } : g
                  ),
                }
              : p
          ),
        }));
      },

      deleteGuide(projectId, guideId) {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  updatedAt: now(),
                  guides: p.guides.filter((g) => g.id !== guideId),
                }
              : p
          ),
          activeGuideId: s.activeGuideId === guideId ? null : s.activeGuideId,
        }));
      },

      addSection(projectId, guideId, title) {
        const section = makeSection(title);
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  updatedAt: now(),
                  guides: p.guides.map((g) =>
                    g.id === guideId
                      ? { ...g, sections: [...g.sections, { ...section, order: g.sections.length }], updatedAt: now() }
                      : g
                  ),
                }
              : p
          ),
        }));
        return section;
      },

      setActiveProject(id) {
        set({ activeProjectId: id, activeGuideId: null });
      },

      setActiveGuide(id) {
        set({ activeGuideId: id });
      },
    }),
    {
      name: 'docmaker_projects_v2',
      storage: createJSONStorage(() => idbStorage),
      // Only persist the projects array — navigation state is ephemeral
      partialize: (state) => ({ projects: state.projects }),
      onRehydrateStorage: () => (state) => {
        // Determine any projects to inject in a single pass — avoids an
        // intermediate IDB write with an empty array before the demo is set.
        let finalProjects: Project[] | null = null;

        if (state && state.projects.length === 0) {
          // ── Try to migrate from old LZ-String localStorage (one-time) ─────
          try {
            const raw = localStorage.getItem('docmaker_projects');
            if (raw) {
              const decompressed = LZString.decompressFromUTF16(raw) ?? raw;
              const migrated = JSON.parse(decompressed) as Project[];
              if (Array.isArray(migrated) && migrated.length > 0) {
                finalProjects = migrated;
                localStorage.removeItem('docmaker_projects');
              }
            }
          } catch { /* ignore migration errors */ }

          // ── Seed demo once per IDB era (V2 key) ───────────────────────────
          // Uses a new key so existing users who never saw the IDB demo get it
          if (!finalProjects && !localStorage.getItem(DEMO_SEEDED_KEY_V2)) {
            localStorage.setItem(DEMO_SEEDED_KEY_V2, 'true');
            finalProjects = [demoProject];
          }
        }

        // One combined setState → one IDB write, no empty-array flash
        useProjectStore.setState({
          _hydrated: true,
          ...(finalProjects ? { projects: finalProjects } : {}),
        });
      },
    }
  )
);
