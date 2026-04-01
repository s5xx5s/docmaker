import { create } from 'zustand';
import type { Project, Guide, Section } from '../types';
import { generateId } from '../utils/id';
import { loadProjects, saveProjects } from '../utils/storage';

interface ProjectStore {
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

  // Persistence
  _persist(): void;
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

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: loadProjects(),
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
    get()._persist();
    return project;
  },

  updateProject(id, patch) {
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === id ? { ...p, ...patch, updatedAt: now() } : p
      ),
    }));
    get()._persist();
  },

  deleteProject(id) {
    set((s) => ({
      projects: s.projects.filter((p) => p.id !== id),
      activeProjectId: s.activeProjectId === id ? null : s.activeProjectId,
    }));
    get()._persist();
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
    get()._persist();
    return copy;
  },

  importProject(project) {
    const withNewId: Project = { ...project, id: generateId(), updatedAt: now() };
    set((s) => ({ projects: [...s.projects, withNewId] }));
    get()._persist();
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
    get()._persist();
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
    get()._persist();
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
    get()._persist();
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
    get()._persist();
    return section;
  },

  setActiveProject(id) {
    set({ activeProjectId: id, activeGuideId: null });
  },

  setActiveGuide(id) {
    set({ activeGuideId: id });
  },

  _persist() {
    saveProjects(get().projects);
  },
}));
