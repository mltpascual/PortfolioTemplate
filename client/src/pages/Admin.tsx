/*
 * Admin Dashboard for managing portfolio content.
 * Only accessible to users with admin role.
 * Tabs: Profile, Projects, Experience, Skills
 * Warm editorial design matching the portfolio theme.
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Pencil,
  X,
  User,
  FolderOpen,
  Briefcase,
  Wrench,
  Loader2,
  GripVertical,
  Palette,
  RotateCcw,
  Upload,
  ImageIcon,
  BarChart3,
  MousePointerClick,
  Eye,
  TrendingUp,
  LogOut,
  ChevronDown,
  GraduationCap,
  LayoutGrid,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableProjectItem } from "@/components/SortableProjectItem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// ============================================================
// PROFILE TAB
// ============================================================
function ProfileTab() {
  const { data: profile, isLoading } = trpc.adminProfile.get.useQuery();
  const utils = trpc.useUtils();
  const updateProfile = trpc.adminProfile.update.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      utils.adminProfile.get.invalidate();
      utils.portfolio.getAll.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const [form, setForm] = useState({
    fullName: "",
    title: "",
    bio: "",
    heroTagline: "",
    heroSubtitle: "",
    avatarUrl: "",
    resumeUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    email: "",
    phone: "",
    location: "",
    yearsExperience: "",
    projectsDelivered: "",
    openSourceContributions: "",
    clientSatisfaction: "",
    availableForWork: 1,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName || "",
        title: profile.title || "",
        bio: profile.bio || "",
        heroTagline: profile.heroTagline || "",
        heroSubtitle: profile.heroSubtitle || "",
        avatarUrl: profile.avatarUrl || "",
        resumeUrl: profile.resumeUrl || "",
        githubUrl: profile.githubUrl || "",
        linkedinUrl: profile.linkedinUrl || "",
        twitterUrl: profile.twitterUrl || "",
        email: profile.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
        yearsExperience: profile.yearsExperience || "",
        projectsDelivered: profile.projectsDelivered || "",
        openSourceContributions: profile.openSourceContributions || "",
        clientSatisfaction: profile.clientSatisfaction || "",
        availableForWork: profile.availableForWork ?? 1,
      });
    }
  }, [profile]);

  if (isLoading) return <LoadingSpinner />;

  const handleSave = () => {
    updateProfile.mutate(form);
  };

  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <FieldGroup title="Basic Information">
        <InputField label="Full Name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} placeholder="Your full name" />
        <InputField label="Title / Role" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="e.g. Full-stack Software Engineer" />
        <TextareaField label="Bio" value={form.bio} onChange={(v) => setForm({ ...form, bio: v })} placeholder="Tell visitors about yourself..." rows={5} />
      </FieldGroup>

      {/* Hero Section */}
      <FieldGroup title="Hero Section">
        <InputField label="Hero Tagline" value={form.heroTagline} onChange={(v) => setForm({ ...form, heroTagline: v })} placeholder="Main headline on your portfolio" />
        <TextareaField label="Hero Subtitle" value={form.heroSubtitle} onChange={(v) => setForm({ ...form, heroSubtitle: v })} placeholder="Supporting text below the headline" rows={3} />
        <InputField label="Avatar / Hero Image URL" value={form.avatarUrl} onChange={(v) => setForm({ ...form, avatarUrl: v })} placeholder="https://..." />
        <InputField label="Resume URL" value={form.resumeUrl} onChange={(v) => setForm({ ...form, resumeUrl: v })} placeholder="Link to your resume PDF" />
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-charcoal" style={{ fontFamily: "var(--font-body)" }}>
            Available for Work
          </label>
          <button
            type="button"
            onClick={() => setForm({ ...form, availableForWork: form.availableForWork === 1 ? 0 : 1 })}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              form.availableForWork === 1 ? "bg-terracotta" : "bg-warm-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                form.availableForWork === 1 ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </FieldGroup>

      {/* Social Links */}
      <FieldGroup title="Social & Contact">
        <InputField label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="your@email.com" />
        <InputField label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+1 (555) 123-4567" />
        <InputField label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="San Francisco, CA" />
        <InputField label="GitHub URL" value={form.githubUrl} onChange={(v) => setForm({ ...form, githubUrl: v })} placeholder="https://github.com/username" />
        <InputField label="LinkedIn URL" value={form.linkedinUrl} onChange={(v) => setForm({ ...form, linkedinUrl: v })} placeholder="https://linkedin.com/in/username" />
        <InputField label="Twitter URL" value={form.twitterUrl} onChange={(v) => setForm({ ...form, twitterUrl: v })} placeholder="https://twitter.com/username" />
      </FieldGroup>

      {/* Stats */}
      <FieldGroup title="Stats (displayed in About section)">
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Years Experience" value={form.yearsExperience} onChange={(v) => setForm({ ...form, yearsExperience: v })} placeholder="5+" />
          <InputField label="Projects Delivered" value={form.projectsDelivered} onChange={(v) => setForm({ ...form, projectsDelivered: v })} placeholder="30+" />
          <InputField label="Open Source Contributions" value={form.openSourceContributions} onChange={(v) => setForm({ ...form, openSourceContributions: v })} placeholder="15+" />
          <InputField label="Client Satisfaction" value={form.clientSatisfaction} onChange={(v) => setForm({ ...form, clientSatisfaction: v })} placeholder="99%" />
        </div>
      </FieldGroup>

      <button
        onClick={handleSave}
        disabled={updateProfile.isPending}
        className="pill-primary gap-2"
      >
        {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save Profile
      </button>
    </div>
  );
}

// ============================================================
// PROJECTS TAB
// ============================================================
function ProjectsTab() {
  const { data: projects, isLoading } = trpc.adminProjects.list.useQuery();
  const utils = trpc.useUtils();
  const createProject = trpc.adminProjects.create.useMutation({
    onSuccess: () => {
      toast.success("Project created!");
      utils.adminProjects.list.invalidate();
      utils.portfolio.getAll.invalidate();
      setEditing(null);
    },
    onError: (err) => toast.error(err.message),
  });
  const updateProject = trpc.adminProjects.update.useMutation({
    onSuccess: () => {
      toast.success("Project updated!");
      utils.adminProjects.list.invalidate();
      utils.portfolio.getAll.invalidate();
      setEditing(null);
    },
    onError: (err) => toast.error(err.message),
  });
  const deleteProject = trpc.adminProjects.delete.useMutation({
    onSuccess: () => {
      toast.success("Project deleted!");
      utils.adminProjects.list.invalidate();
      utils.portfolio.getAll.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const reorderProjects = trpc.adminProjects.reorder.useMutation({
    onSuccess: () => {
      toast.success("Order saved!");
      utils.adminProjects.list.invalidate();
      utils.portfolio.getAll.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const bulkTileSize = trpc.adminProjects.bulkTileSize.useMutation({
    onSuccess: (_, vars) => {
      toast.success(`All projects set to ${vars.tileSize}!`);
      utils.adminProjects.list.invalidate();
      utils.portfolio.getAll.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    liveUrl: "",
    githubUrl: "",
    tags: "",
    featured: 0,
    tileSize: "medium" as string,
    sortOrder: 0,
  });

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id || !projects) return;

      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove([...projects], oldIndex, newIndex);
      const items = reordered.map((p, i) => ({ id: p.id, sortOrder: i + 1 }));
      reorderProjects.mutate({ items });
    },
    [projects, reorderProjects]
  );

  const startEdit = (project: any) => {
    setEditing(project.id);
    setForm({
      title: project.title || "",
      description: project.description || "",
      imageUrl: project.imageUrl || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      tags: project.tags || "",
      featured: project.featured || 0,
      tileSize: project.tileSize || "medium",
      sortOrder: project.sortOrder || 0,
    });
  };

  const startNew = () => {
    setEditing("new");
    setForm({ title: "", description: "", imageUrl: "", liveUrl: "", githubUrl: "", tags: "", featured: 0, tileSize: "medium", sortOrder: (projects?.length || 0) + 1 });
  };

  const handleSave = () => {
    const payload = { ...form, tileSize: form.tileSize as any };
    if (editing === "new") {
      createProject.mutate(payload);
    } else if (typeof editing === "number") {
      updateProject.mutate({ id: editing, ...payload });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>
          {projects?.length || 0} project{(projects?.length || 0) !== 1 ? "s" : ""}
        </p>
        <button onClick={startNew} className="pill-primary-sm gap-2">
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Project Edit/Create Modal */}
      <Dialog open={editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-cream border-warm-200">
          <DialogHeader>
            <DialogTitle className="text-xl text-charcoal" style={{ fontFamily: "var(--font-display)" }}>
              {editing === "new" ? "New Project" : "Edit Project"}
            </DialogTitle>
            <DialogDescription className="text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>
              {editing === "new" ? "Add a new project to your portfolio." : "Update the details of this project."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <InputField label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Project name" />
            <TextareaField label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="What does this project do?" rows={3} />
            <ImageUploadField
              label="Project Screenshot"
              value={form.imageUrl}
              onChange={(v) => setForm({ ...form, imageUrl: v })}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Live URL" value={form.liveUrl} onChange={(v) => setForm({ ...form, liveUrl: v })} placeholder="https://..." />
              <InputField label="GitHub URL" value={form.githubUrl} onChange={(v) => setForm({ ...form, githubUrl: v })} placeholder="https://..." />
            </div>
            <InputField label="Tags (comma-separated)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} placeholder="React, TypeScript, Node.js" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InputField label="Sort Order" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: parseInt(v) || 0 })} placeholder="1" />
              <div className="flex items-center gap-3 pt-6">
                <label className="text-sm font-medium text-charcoal" style={{ fontFamily: "var(--font-body)" }}>Featured</label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, featured: form.featured === 1 ? 0 : 1 })}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${form.featured === 1 ? "bg-terracotta" : "bg-warm-300"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${form.featured === 1 ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2" style={{ fontFamily: "var(--font-body)" }}>Tile Size</label>
                <div className="flex flex-wrap gap-1.5">
                  {(["small", "medium", "large", "wide"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setForm({ ...form, tileSize: size })}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors capitalize ${
                        form.tileSize === size
                          ? "bg-terracotta text-white"
                          : "bg-warm-50 text-charcoal-light border border-warm-200 hover:bg-warm-100"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-full text-sm font-medium text-charcoal-light hover:bg-warm-100 transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={createProject.isPending || updateProject.isPending} className="pill-primary gap-2">
                {(createProject.isPending || updateProject.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editing === "new" ? "Create Project" : "Update Project"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Tile Size Controls */}
      {projects && projects.length > 0 && (
        <div className="warm-card p-4">
          <p className="text-xs font-medium text-charcoal-light mb-2" style={{ fontFamily: "var(--font-body)" }}>
            Set All Tile Sizes
          </p>
          <div className="flex flex-wrap gap-2">
            {(["small", "medium", "large", "wide"] as const).map((size) => (
              <button
                key={size}
                onClick={() => bulkTileSize.mutate({ tileSize: size })}
                disabled={bulkTileSize.isPending}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  bulkTileSize.isPending
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-terracotta hover:text-white hover:border-terracotta"
                } border-warm-300 text-charcoal`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {bulkTileSize.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
                ) : null}
                All {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Drag-and-Drop Project List */}
      {projects && projects.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={projects.map((p) => p.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <SortableProjectItem
                  key={project.id}
                  project={project}
                  onEdit={startEdit}
                  onDelete={(id) => deleteProject.mutate({ id })}
                />
              ))}
            </div>
          </SortableContext>
          {reorderProjects.isPending && (
            <div className="flex items-center justify-center gap-2 py-2 text-sm text-charcoal-light">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving order...
            </div>
          )}
        </DndContext>
      ) : (
        <div className="text-center py-12 text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>
          <FolderOpen className="w-10 h-10 mx-auto mb-3 text-warm-300" />
          <p>No projects yet. Add your first project above.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// EXPERIENCE TAB
// ============================================================
function ExperienceTab() {
  const { data: experiences, isLoading } = trpc.adminExperiences.list.useQuery();
  const utils = trpc.useUtils();
  const createExp = trpc.adminExperiences.create.useMutation({
    onSuccess: () => { toast.success("Experience added!"); utils.adminExperiences.list.invalidate(); utils.portfolio.getAll.invalidate(); setEditing(null); },
    onError: (err) => toast.error(err.message),
  });
  const updateExp = trpc.adminExperiences.update.useMutation({
    onSuccess: () => { toast.success("Experience updated!"); utils.adminExperiences.list.invalidate(); utils.portfolio.getAll.invalidate(); setEditing(null); },
    onError: (err) => toast.error(err.message),
  });
  const deleteExp = trpc.adminExperiences.delete.useMutation({
    onSuccess: () => { toast.success("Experience deleted!"); utils.adminExperiences.list.invalidate(); utils.portfolio.getAll.invalidate(); },
    onError: (err) => toast.error(err.message),
  });

  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [form, setForm] = useState({ role: "", company: "", period: "", description: "", tags: "", logoUrl: "", sortOrder: 0 });

  const startEdit = (exp: any) => {
    setEditing(exp.id);
    setForm({ role: exp.role || "", company: exp.company || "", period: exp.period || "", description: exp.description || "", tags: exp.tags || "", logoUrl: exp.logoUrl || "", sortOrder: exp.sortOrder || 0 });
  };

  const startNew = () => {
    setEditing("new");
    setForm({ role: "", company: "", period: "", description: "", tags: "", logoUrl: "", sortOrder: (experiences?.length || 0) + 1 });
  };

  const handleSave = () => {
    if (editing === "new") createExp.mutate(form);
    else if (typeof editing === "number") updateExp.mutate({ id: editing, ...form });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>
          {experiences?.length || 0} experience{(experiences?.length || 0) !== 1 ? "s" : ""}
        </p>
        <button onClick={startNew} className="pill-primary-sm gap-2">
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {/* Experience Edit/Create Modal */}
      <Dialog open={editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-cream border-warm-200">
          <DialogHeader>
            <DialogTitle className="text-xl text-charcoal" style={{ fontFamily: "var(--font-display)" }}>
              {editing === "new" ? "New Experience" : "Edit Experience"}
            </DialogTitle>
            <DialogDescription className="text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>
              {editing === "new" ? "Add a new work experience entry." : "Update this experience entry."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Role / Title" value={form.role} onChange={(v) => setForm({ ...form, role: v })} placeholder="Senior Software Engineer" />
              <InputField label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} placeholder="Company Name" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Period" value={form.period} onChange={(v) => setForm({ ...form, period: v })} placeholder="2023 — Present" />
              <InputField label="Sort Order" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: parseInt(v) || 0 })} placeholder="1" />
            </div>
            <TextareaField label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="What did you accomplish?" rows={3} />
            <InputField label="Tags (comma-separated)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} placeholder="React, TypeScript, Leadership" />
            <ImageUploadField label="Company Logo" value={form.logoUrl} onChange={(v) => setForm({ ...form, logoUrl: v })} />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-full text-sm font-medium text-charcoal-light hover:bg-warm-100 transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={createExp.isPending || updateExp.isPending} className="pill-primary gap-2">
                {(createExp.isPending || updateExp.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editing === "new" ? "Create" : "Update"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        {experiences?.map((exp) => (
          <div key={exp.id} className="warm-card p-4 flex items-center gap-4">
            <GripVertical className="w-4 h-4 text-warm-300 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="text-base text-charcoal truncate" style={{ fontFamily: "var(--font-display)" }}>{exp.role}</h4>
              <p className="text-sm text-terracotta" style={{ fontFamily: "var(--font-body)" }}>{exp.company} &middot; {exp.period}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => startEdit(exp)} className="p-2 rounded-full hover:bg-warm-100 transition-colors"><Pencil className="w-4 h-4 text-charcoal-light" /></button>
              <button onClick={() => { if (confirm("Delete?")) deleteExp.mutate({ id: exp.id }); }} className="p-2 rounded-full hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
            </div>
          </div>
        ))}
        {(!experiences || experiences.length === 0) && (
          <div className="text-center py-12 text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>
            <Briefcase className="w-10 h-10 mx-auto mb-3 text-warm-300" />
            <p>No experiences yet. Add your first one above.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SKILLS TAB
// ============================================================
function SkillsTab() {
  const { data: skills, isLoading } = trpc.adminSkills.list.useQuery();
  const utils = trpc.useUtils();
  const createSkill = trpc.adminSkills.create.useMutation({
    onSuccess: () => { toast.success("Skill category added!"); utils.adminSkills.list.invalidate(); utils.portfolio.getAll.invalidate(); setEditing(null); },
    onError: (err) => toast.error(err.message),
  });
  const updateSkill = trpc.adminSkills.update.useMutation({
    onSuccess: () => { toast.success("Skill category updated!"); utils.adminSkills.list.invalidate(); utils.portfolio.getAll.invalidate(); setEditing(null); },
    onError: (err) => toast.error(err.message),
  });
  const deleteSkill = trpc.adminSkills.delete.useMutation({
    onSuccess: () => { toast.success("Skill category deleted!"); utils.adminSkills.list.invalidate(); utils.portfolio.getAll.invalidate(); },
    onError: (err) => toast.error(err.message),
  });

  const iconOptions = ["Code2", "Server", "Database", "Globe", "Smartphone", "Palette", "Terminal", "Layers", "Cpu", "Cloud", "Shield", "Zap"];

  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [form, setForm] = useState({ title: "", icon: "Code2", skills: "", sortOrder: 0 });

  const startEdit = (skill: any) => {
    setEditing(skill.id);
    setForm({ title: skill.title || "", icon: skill.icon || "Code2", skills: skill.skills || "", sortOrder: skill.sortOrder || 0 });
  };

  const startNew = () => {
    setEditing("new");
    setForm({ title: "", icon: "Code2", skills: "", sortOrder: (skills?.length || 0) + 1 });
  };

  const handleSave = () => {
    if (editing === "new") createSkill.mutate(form);
    else if (typeof editing === "number") updateSkill.mutate({ id: editing, ...form });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>
          {skills?.length || 0} categor{(skills?.length || 0) !== 1 ? "ies" : "y"}
        </p>
        <button onClick={startNew} className="pill-primary-sm gap-2">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Skills Edit/Create Modal */}
      <Dialog open={editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-cream border-warm-200">
          <DialogHeader>
            <DialogTitle className="text-xl text-charcoal" style={{ fontFamily: "var(--font-display)" }}>
              {editing === "new" ? "New Skill Category" : "Edit Category"}
            </DialogTitle>
            <DialogDescription className="text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>
              {editing === "new" ? "Add a new skill category to your portfolio." : "Update this skill category."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Category Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="e.g. Frontend" />
              <InputField label="Sort Order" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: parseInt(v) || 0 })} placeholder="1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2" style={{ fontFamily: "var(--font-body)" }}>Icon</label>
              <div className="flex flex-wrap gap-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setForm({ ...form, icon })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      form.icon === icon
                        ? "bg-terracotta text-white"
                        : "bg-warm-100 text-charcoal-light border border-warm-200/60 hover:border-terracotta-light"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <TextareaField label="Skills (comma-separated)" value={form.skills} onChange={(v) => setForm({ ...form, skills: v })} placeholder="React, TypeScript, Next.js, Vue.js, Tailwind CSS" rows={2} />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-full text-sm font-medium text-charcoal-light hover:bg-warm-100 transition-colors" style={{ fontFamily: "var(--font-body)" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={createSkill.isPending || updateSkill.isPending} className="pill-primary gap-2">
                {(createSkill.isPending || updateSkill.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editing === "new" ? "Create" : "Update"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        {skills?.map((skill) => (
          <div key={skill.id} className="warm-card p-4 flex items-center gap-4">
            <GripVertical className="w-4 h-4 text-warm-300 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta font-medium">{skill.icon}</span>
                <h4 className="text-base text-charcoal truncate" style={{ fontFamily: "var(--font-display)" }}>{skill.title}</h4>
              </div>
              <p className="text-sm text-charcoal-light truncate mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{skill.skills || "No skills listed"}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => startEdit(skill)} className="p-2 rounded-full hover:bg-warm-100 transition-colors"><Pencil className="w-4 h-4 text-charcoal-light" /></button>
              <button onClick={() => { if (confirm("Delete?")) deleteSkill.mutate({ id: skill.id }); }} className="p-2 rounded-full hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
            </div>
          </div>
        ))}
        {(!skills || skills.length === 0) && (
          <div className="text-center py-12 text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>
            <Wrench className="w-10 h-10 mx-auto mb-3 text-warm-300" />
            <p>No skill categories yet. Add your first one above.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SHARED COMPONENTS
// ============================================================
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
    </div>
  );
}

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="warm-card p-6 md:p-8 space-y-4">
      <h3 className="text-xl text-charcoal mb-2" style={{ fontFamily: "var(--font-display)" }}>{title}</h3>
      {children}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-charcoal mb-1.5" style={{ fontFamily: "var(--font-body)" }}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl bg-warm-50 border border-warm-200 text-charcoal placeholder:text-charcoal-light/50 focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all text-sm"
        style={{ fontFamily: "var(--font-body)" }}
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <div>
      <label className="block text-sm font-medium text-charcoal mb-1.5" style={{ fontFamily: "var(--font-body)" }}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-2.5 rounded-xl bg-warm-50 border border-warm-200 text-charcoal placeholder:text-charcoal-light/50 focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all text-sm resize-none"
        style={{ fontFamily: "var(--font-body)" }}
      />
    </div>
  );
}

function ImageUploadField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const uploadMutation = trpc.adminUpload.image.useMutation();

  // Compress image on client side to fit within Vercel's 4.5MB body limit
  const compressImage = async (file: File, maxSizeKB: number = 2500): Promise<{ base64: string; contentType: string; fileName: string }> => {
    // SVGs don't need compression
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      return { base64, contentType: file.type, fileName: file.name };
    }

    // Load image into canvas for compression
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = objectUrl;
    });
    URL.revokeObjectURL(objectUrl);

    // Resize if too large (max 1920px on longest side)
    let { width, height } = img;
    const maxDim = 1920;
    if (width > maxDim || height > maxDim) {
      const ratio = Math.min(maxDim / width, maxDim / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, width, height);

    // Try JPEG compression at decreasing quality until under maxSizeKB
    let quality = 0.85;
    let base64 = "";
    let contentType = "image/jpeg";
    const ext = file.name.replace(/\.[^.]+$/, "") + ".jpg";

    for (let attempt = 0; attempt < 5; attempt++) {
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      base64 = dataUrl.split(",")[1];
      const sizeKB = (base64.length * 3) / 4 / 1024;
      if (sizeKB <= maxSizeKB) break;
      quality -= 0.15;
    }

    return { base64, contentType, fileName: ext };
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG");
      return;
    }

    // Validate original file size (reject files over 20MB even before compression)
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File too large. Please select an image under 20MB.");
      return;
    }

    setUploading(true);
    try {
      // Compress image client-side (resize + JPEG quality reduction)
      const toastId = file.size > 1 * 1024 * 1024 ? toast.loading("Compressing image...") : undefined;
      const { base64, contentType, fileName } = await compressImage(file);
      if (toastId) toast.dismiss(toastId);

      // Check compressed size (base64 is ~33% larger, Vercel limit is 4.5MB body)
      const compressedSizeKB = (base64.length * 3) / 4 / 1024;
      if (compressedSizeKB > 3000) {
        toast.error(`Image is still too large after compression (${(compressedSizeKB / 1024).toFixed(1)}MB). Please use a smaller image.`);
        return;
      }

      // Upload via tRPC mutation
      const result = await uploadMutation.mutateAsync({
        fileData: base64,
        fileName,
        contentType: contentType as any,
      });

      onChange(result.url);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      // Handle specific error cases with clear messages
      const msg = error?.message || "";
      if (msg.includes("413") || msg.includes("Content Too Large") || msg.includes("entity too large") || msg.includes("Request En")) {
        toast.error("Image is too large for the server. Please use a smaller image (under 3MB recommended).");
      } else if (msg.includes("401") || msg.includes("Unauthorized")) {
        toast.error("Session expired. Please refresh the page and try again.");
      } else if (msg.includes("403") || msg.includes("Forbidden")) {
        toast.error("You don't have permission to upload images.");
      } else {
        toast.error(msg || "Upload failed. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-charcoal mb-1.5" style={{ fontFamily: "var(--font-body)" }}>{label}</label>
      
      {/* Current image preview */}
      {value && (
        <div className="mb-3 relative group">
          <img
            src={value}
            alt="Preview"
            className="w-full max-h-48 object-cover rounded-xl border border-warm-200"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            title="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer ${
          dragOver
            ? "border-terracotta bg-terracotta/5"
            : "border-warm-200 bg-warm-50 hover:border-warm-300 hover:bg-warm-100/50"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        <div className="flex flex-col items-center justify-center py-6 px-4">
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-terracotta animate-spin mb-2" />
              <p className="text-sm text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-warm-300 mb-2" />
              <p className="text-sm text-charcoal" style={{ fontFamily: "var(--font-body)" }}>
                <span className="text-terracotta font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-charcoal-light/60 mt-1" style={{ fontFamily: "var(--font-body)" }}>
                JPEG, PNG, GIF, WebP, SVG (max 7.5MB)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Manual URL fallback */}
      <div className="mt-2">
        <details className="group">
          <summary className="text-xs text-charcoal-light/60 cursor-pointer hover:text-charcoal-light transition-colors" style={{ fontFamily: "var(--font-body)" }}>
            Or paste image URL manually
          </summary>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="mt-2 w-full px-4 py-2 rounded-xl bg-warm-50 border border-warm-200 text-charcoal placeholder:text-charcoal-light/50 focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all text-sm"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </details>
      </div>
    </div>
  );
}

// ============================================================
// EDUCATION TAB
// ============================================================
function EducationTab() {
  const utils = trpc.useUtils();
  const { data: educationList, isLoading } = trpc.adminEducation.list.useQuery();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  const [endYear, setEndYear] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [logoUrl, setLogoUrl] = useState("");

  const createMutation = trpc.adminEducation.create.useMutation({
    onSuccess: () => { utils.adminEducation.list.invalidate(); toast.success("Education added!"); resetForm(); },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = trpc.adminEducation.update.useMutation({
    onSuccess: () => { utils.adminEducation.list.invalidate(); toast.success("Education updated!"); resetForm(); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = trpc.adminEducation.delete.useMutation({
    onSuccess: () => { utils.adminEducation.list.invalidate(); toast.success("Education deleted!"); },
    onError: (e) => toast.error(e.message),
  });

  function resetForm() {
    setShowModal(false);
    setEditingId(null);
    setInstitution("");
    setDegree("");
    setFieldOfStudy("");
    setStartYear(new Date().getFullYear());
    setEndYear(null);
    setDescription("");
    setSortOrder(0);
    setLogoUrl("");
  }

  function openCreate() {
    resetForm();
    setShowModal(true);
  }

  function openEdit(edu: any) {
    setEditingId(edu.id);
    setInstitution(edu.institution || "");
    setDegree(edu.degree || "");
    setFieldOfStudy(edu.fieldOfStudy || "");
    setStartYear(edu.startYear || new Date().getFullYear());
    setEndYear(edu.endYear || null);
    setDescription(edu.description || "");
    setSortOrder(edu.sortOrder || 0);
    setLogoUrl(edu.logoUrl || "");
    setShowModal(true);
  }

  function handleSave() {
    if (editingId) {
      updateMutation.mutate({ id: editingId, institution, degree, fieldOfStudy: fieldOfStudy || undefined, startYear, endYear, description: description || undefined, logoUrl: logoUrl || undefined, sortOrder });
    } else {
      createMutation.mutate({ institution, degree, fieldOfStudy: fieldOfStudy || undefined, startYear, endYear, description: description || undefined, logoUrl: logoUrl || undefined, sortOrder });
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-terracotta" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-charcoal" style={{ fontFamily: "var(--font-display)" }}>Education</h2>
        <button onClick={openCreate} className="pill-primary-sm flex items-center gap-2"><Plus className="w-4 h-4" />Add Education</button>
      </div>

      {/* Education Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {educationList?.map((edu: any) => (
          <div key={edu.id} className="warm-card p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-charcoal truncate" style={{ fontFamily: "var(--font-display)" }}>{edu.degree}</h3>
                <p className="text-sm text-terracotta font-medium truncate" style={{ fontFamily: "var(--font-body)" }}>{edu.institution}</p>
                {edu.fieldOfStudy && <p className="text-xs text-charcoal-light mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{edu.fieldOfStudy}</p>}
              </div>
              <span className="text-xs text-charcoal-light whitespace-nowrap px-2 py-1 rounded-full bg-warm-100 border border-warm-200/60 ml-2">
                {edu.startYear} — {edu.endYear || "Present"}
              </span>
            </div>
            {edu.description && <p className="text-sm text-charcoal-light line-clamp-2" style={{ fontFamily: "var(--font-body)" }}>{edu.description}</p>}
            <div className="flex gap-2 pt-1">
              <button onClick={() => openEdit(edu)} className="text-xs px-3 py-1.5 rounded-full border border-warm-200 text-charcoal-light hover:text-terracotta hover:border-terracotta-light transition-all flex items-center gap-1">
                <Pencil className="w-3 h-3" />Edit
              </button>
              <button onClick={() => { if (confirm("Delete this education entry?")) deleteMutation.mutate({ id: edu.id }); }} className="text-xs px-3 py-1.5 rounded-full border border-warm-200 text-charcoal-light hover:text-red-500 hover:border-red-300 transition-all flex items-center gap-1">
                <Trash2 className="w-3 h-3" />Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {(!educationList || educationList.length === 0) && (
        <div className="text-center py-12 text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>
          <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No education entries yet. Click "Add Education" to get started.</p>
        </div>
      )}

      {/* Education Modal */}
      {showModal && (
        <Dialog open={showModal} onOpenChange={(open) => { if (!open) resetForm(); }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-cream border-warm-200">
            <DialogHeader>
              <DialogTitle className="text-xl text-charcoal" style={{ fontFamily: "var(--font-display)" }}>
                {editingId ? "Edit Education" : "Add Education"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <InputField label="Institution" value={institution} onChange={setInstitution} placeholder="e.g. MIT, Stanford University" />
              <InputField label="Degree" value={degree} onChange={setDegree} placeholder="e.g. Bachelor of Science, Master of Arts" />
              <InputField label="Field of Study" value={fieldOfStudy} onChange={setFieldOfStudy} placeholder="e.g. Computer Science, Business Administration" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Start Year</label>
                  <input type="number" value={startYear} onChange={(e) => setStartYear(parseInt(e.target.value) || 2020)} min={1950} max={2100} className="w-full px-4 py-2.5 rounded-xl border border-warm-200 bg-white/80 text-charcoal focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta outline-none transition-all" style={{ fontFamily: "var(--font-body)" }} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5" style={{ fontFamily: "var(--font-body)" }}>End Year (leave empty for "Present")</label>
                  <input type="number" value={endYear ?? ""} onChange={(e) => setEndYear(e.target.value ? parseInt(e.target.value) : null)} min={1950} max={2100} placeholder="Present" className="w-full px-4 py-2.5 rounded-xl border border-warm-200 bg-white/80 text-charcoal focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta outline-none transition-all" style={{ fontFamily: "var(--font-body)" }} />
                </div>
              </div>
              <TextareaField label="Description" value={description} onChange={setDescription} placeholder="Describe your studies, achievements, activities..." />
              <InputField label="Sort Order" value={String(sortOrder)} onChange={(v) => setSortOrder(parseInt(v) || 0)} placeholder="0" />
              <ImageUploadField label="Institution Logo" value={logoUrl} onChange={setLogoUrl} />
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={isSaving || !institution || !degree} className="pill-primary-sm flex items-center gap-2 disabled:opacity-50">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingId ? "Update" : "Create"}
                </button>
                <button onClick={resetForm} className="pill-outline-sm">Cancel</button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// ============================================================
// THEME TAB
// ============================================================
function ThemeTab() {
  const utils = trpc.useUtils();
  const { data: theme, isLoading } = trpc.adminTheme.get.useQuery();
  const updateMutation = trpc.adminTheme.update.useMutation({
    onSuccess: () => {
      utils.adminTheme.get.invalidate();
      utils.theme.get.invalidate();
      toast.success("Theme updated successfully!");
    },
    onError: (err) => toast.error(err.message),
  });
  const resetMutation = trpc.adminTheme.reset.useMutation({
    onSuccess: () => {
      utils.adminTheme.get.invalidate();
      utils.theme.get.invalidate();
      toast.success("Theme reset to defaults!");
    },
    onError: (err) => toast.error(err.message),
  });

  const [accentColor, setAccentColor] = useState("#B85C38");
  const [accentColorHover, setAccentColorHover] = useState("#9A4A2E");
  const [headingFont, setHeadingFont] = useState("DM Serif Display");
  const [bodyFont, setBodyFont] = useState("DM Sans");
  const [darkMode, setDarkMode] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const HEADING_FONTS = [
    "DM Serif Display", "Playfair Display", "Lora", "Merriweather",
    "Cormorant Garamond", "Libre Baskerville", "EB Garamond", "Crimson Text",
    "Bitter", "Josefin Sans", "Montserrat", "Raleway", "Poppins", "Inter", "Space Grotesk",
  ];
  const BODY_FONTS = [
    "DM Sans", "Inter", "Poppins", "Nunito", "Open Sans", "Lato",
    "Source Sans 3", "Roboto", "Work Sans", "Outfit", "Plus Jakarta Sans",
    "Manrope", "Figtree", "IBM Plex Sans",
  ];

  // Load Google Fonts for preview
  const loadFont = (fontName: string) => {
    const encoded = encodeURIComponent(fontName);
    const linkId = `google-font-${encoded}`;
    if (document.getElementById(linkId)) return;
    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encoded.replace(/%20/g, "+")}:wght@300;400;500;600;700&display=swap`;
    document.head.appendChild(link);
  };

  useEffect(() => {
    if (theme && !initialized) {
      setAccentColor(theme.accentColor || "#B85C38");
      setAccentColorHover(theme.accentColorHover || "#9A4A2E");
      setHeadingFont(theme.headingFont || "DM Serif Display");
      setBodyFont(theme.bodyFont || "DM Sans");
      setDarkMode(theme.darkMode ?? false);
      setInitialized(true);
    }
  }, [theme, initialized]);

  // Load fonts when they change
  useEffect(() => { loadFont(headingFont); }, [headingFont]);
  useEffect(() => { loadFont(bodyFont); }, [bodyFont]);

  const handleAccentChange = (hex: string) => {
    setAccentColor(hex);
    const h = hex.replace("#", "");
    const r = Math.max(0, Math.round(parseInt(h.substring(0, 2), 16) * 0.85));
    const g = Math.max(0, Math.round(parseInt(h.substring(2, 4), 16) * 0.85));
    const b = Math.max(0, Math.round(parseInt(h.substring(4, 6), 16) * 0.85));
    setAccentColorHover(`#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`);
  };

  const handleSave = () => {
    updateMutation.mutate({
      accentColor,
      accentColorHover,
      headingFont: headingFont as any,
      bodyFont: bodyFont as any,
      darkMode,
    });
  };

  const handleReset = () => {
    setAccentColor("#B85C38");
    setAccentColorHover("#9A4A2E");
    setHeadingFont("DM Serif Display");
    setBodyFont("DM Sans");
    setDarkMode(false);
    resetMutation.mutate();
  };

  const isDefault =
    accentColor === "#B85C38" &&
    headingFont === "DM Serif Display" &&
    bodyFont === "DM Sans" &&
    darkMode === false;

  if (isLoading) return <LoadingSpinner />;

  const presetColors = [
    { name: "Terracotta", hex: "#B85C38" },
    { name: "Ocean Blue", hex: "#2563EB" },
    { name: "Forest Green", hex: "#16A34A" },
    { name: "Royal Purple", hex: "#7C3AED" },
    { name: "Rose Pink", hex: "#E11D48" },
    { name: "Amber Gold", hex: "#D97706" },
    { name: "Teal", hex: "#0D9488" },
    { name: "Slate", hex: "#475569" },
    { name: "Indigo", hex: "#4F46E5" },
    { name: "Coral", hex: "#F97316" },
  ];

  // Preview colors
  const previewBg = darkMode ? "#1a1a2e" : "#f5f0eb";
  const previewCardBg = darkMode ? "#222240" : "#ffffff";
  const previewText = darkMode ? "#e8e0d8" : "#3d3229";
  const previewTextMuted = darkMode ? "#a09890" : "#6b5e52";
  const previewBorder = darkMode ? "#333355" : "#e8e0d8";

  return (
    <div className="space-y-8">
      {/* Live Preview Panel */}
      <div className="warm-card p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-xl text-charcoal" style={{ fontFamily: "var(--font-display)" }}>
            Live Preview
          </h3>
          <p className="text-sm text-charcoal-light mt-1" style={{ fontFamily: "var(--font-body)" }}>
            See how your portfolio will look with the current theme settings.
          </p>
        </div>

        {/* Mini Portfolio Preview */}
        <div
          className="rounded-2xl border-2 overflow-hidden transition-all duration-300"
          style={{ borderColor: previewBorder }}
        >
          {/* Mini Navbar */}
          <div
            className="flex items-center justify-between px-6 py-3 border-b transition-all duration-300"
            style={{ backgroundColor: darkMode ? "rgba(26,26,46,0.9)" : "rgba(245,240,235,0.9)", borderColor: previewBorder }}
          >
            <span
              className="text-base font-semibold transition-colors duration-300"
              style={{ fontFamily: `'${headingFont}', Georgia, serif`, color: previewText }}
            >
              Your Name
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs transition-colors duration-300" style={{ fontFamily: `'${bodyFont}', sans-serif`, color: previewTextMuted }}>About</span>
              <span className="text-xs transition-colors duration-300" style={{ fontFamily: `'${bodyFont}', sans-serif`, color: previewTextMuted }}>Projects</span>
              <span className="text-xs transition-colors duration-300" style={{ fontFamily: `'${bodyFont}', sans-serif`, color: previewTextMuted }}>Contact</span>
              <span
                className="text-xs px-3 py-1 rounded-full text-white transition-all duration-300"
                style={{ backgroundColor: accentColor, fontFamily: `'${bodyFont}', sans-serif` }}
              >
                Get in Touch
              </span>
            </div>
          </div>

          {/* Mini Hero Section */}
          <div
            className="px-6 py-10 transition-all duration-300"
            style={{ backgroundColor: previewBg }}
          >
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs mb-4 transition-colors duration-300"
                  style={{ backgroundColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)", color: previewTextMuted }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                  Available for work
                </div>
                <h2
                  className="text-2xl md:text-3xl leading-tight mb-3 transition-colors duration-300"
                  style={{ fontFamily: `'${headingFont}', Georgia, serif`, color: previewText }}
                >
                  Crafting digital experiences with purpose.
                </h2>
                <p
                  className="text-sm leading-relaxed mb-5 transition-colors duration-300"
                  style={{ fontFamily: `'${bodyFont}', system-ui, sans-serif`, color: previewTextMuted }}
                >
                  Full-stack software engineer building scalable web applications.
                </p>
                <div className="flex gap-3">
                  <span
                    className="text-xs px-4 py-2 rounded-full text-white transition-all duration-300"
                    style={{ backgroundColor: accentColor }}
                  >
                    View My Work
                  </span>
                  <span
                    className="text-xs px-4 py-2 rounded-full border transition-all duration-300"
                    style={{ borderColor: previewBorder, color: previewText }}
                  >
                    Let's Connect
                  </span>
                </div>
              </div>
              <div
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex-shrink-0 transition-colors duration-300"
                style={{ backgroundColor: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}
              />
            </div>
          </div>

          {/* Mini Skills Section */}
          <div
            className="px-6 py-6 border-t transition-all duration-300"
            style={{ backgroundColor: previewBg, borderColor: previewBorder }}
          >
            <h3
              className="text-sm font-semibold mb-3 transition-colors duration-300"
              style={{ fontFamily: `'${headingFont}', Georgia, serif`, color: previewText }}
            >
              Skills & Expertise
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {["Frontend", "Backend", "Design"].map((skill) => (
                <div
                  key={skill}
                  className="p-2.5 rounded-xl text-center transition-all duration-300"
                  style={{ backgroundColor: previewCardBg, border: `1px solid ${previewBorder}` }}
                >
                  <div
                    className="w-5 h-5 rounded-lg mx-auto mb-1.5 flex items-center justify-center transition-colors duration-300"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: accentColor }} />
                  </div>
                  <span
                    className="text-xs font-medium transition-colors duration-300"
                    style={{ fontFamily: `'${bodyFont}', sans-serif`, color: previewText }}
                  >
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="warm-card p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl text-charcoal" style={{ fontFamily: "var(--font-display)" }}>
              Dark Mode
            </h3>
            <p className="text-sm text-charcoal-light mt-1" style={{ fontFamily: "var(--font-body)" }}>
              Switch between light and dark backgrounds for your portfolio.
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
              darkMode ? "" : "bg-warm-300"
            }`}
            style={darkMode ? { backgroundColor: accentColor } : {}}
            aria-label="Toggle dark mode"
          >
            <span
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${
                darkMode ? "left-7" : "left-0.5"
              }`}
            />
            <span className="sr-only">{darkMode ? "Dark mode on" : "Dark mode off"}</span>
          </button>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div
            className="flex-1 p-3 rounded-xl border-2 text-center cursor-pointer transition-all duration-200"
            onClick={() => setDarkMode(false)}
            style={{
              borderColor: !darkMode ? accentColor : "var(--color-warm-200)",
              backgroundColor: !darkMode ? `${accentColor}10` : "transparent",
            }}
          >
            <div className="w-8 h-8 mx-auto rounded-lg mb-2" style={{ backgroundColor: "#f5f0eb" }}>
              <div className="w-full h-full rounded-lg border" style={{ borderColor: "#e8e0d8" }} />
            </div>
            <span className="text-xs font-medium text-charcoal" style={{ fontFamily: "var(--font-body)" }}>Light</span>
          </div>
          <div
            className="flex-1 p-3 rounded-xl border-2 text-center cursor-pointer transition-all duration-200"
            onClick={() => setDarkMode(true)}
            style={{
              borderColor: darkMode ? accentColor : "var(--color-warm-200)",
              backgroundColor: darkMode ? `${accentColor}10` : "transparent",
            }}
          >
            <div className="w-8 h-8 mx-auto rounded-lg mb-2" style={{ backgroundColor: "#1a1a2e" }}>
              <div className="w-full h-full rounded-lg border" style={{ borderColor: "#333355" }} />
            </div>
            <span className="text-xs font-medium text-charcoal" style={{ fontFamily: "var(--font-body)" }}>Dark</span>
          </div>
        </div>
      </div>

      {/* Color Accent Section */}
      <div className="warm-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl text-charcoal" style={{ fontFamily: "var(--font-display)" }}>
              Color Accent
            </h3>
            <p className="text-sm text-charcoal-light mt-1" style={{ fontFamily: "var(--font-body)" }}>
              Choose the primary accent color used throughout your portfolio.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => handleAccentChange(e.target.value)}
              className="w-16 h-16 rounded-xl border-2 border-warm-200 cursor-pointer appearance-none bg-transparent"
              style={{ padding: 0 }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-charcoal mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
              Accent Color
            </label>
            <input
              type="text"
              value={accentColor}
              onChange={(e) => {
                const val = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                  setAccentColor(val);
                  if (val.length === 7) handleAccentChange(val);
                }
              }}
              placeholder="#B85C38"
              className="w-full max-w-[200px] px-4 py-2.5 rounded-xl bg-warm-50 border border-warm-200 text-charcoal placeholder:text-charcoal-light/50 focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all text-sm font-mono"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-charcoal mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
              Hover Color
            </label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg border border-warm-200"
                style={{ backgroundColor: accentColorHover }}
              />
              <span className="text-sm text-charcoal-light font-mono">{accentColorHover}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-3" style={{ fontFamily: "var(--font-body)" }}>
            Preset Colors
          </label>
          <div className="flex flex-wrap gap-3">
            {presetColors.map((preset) => (
              <button
                key={preset.hex}
                onClick={() => handleAccentChange(preset.hex)}
                className={`group relative w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                  accentColor === preset.hex ? "border-charcoal ring-2 ring-charcoal/20 scale-110" : "border-warm-200 hover:border-warm-400"
                }`}
                style={{ backgroundColor: preset.hex }}
                title={preset.name}
              >
                {accentColor === preset.hex && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fonts Section */}
      <div className="warm-card p-6 md:p-8">
        <div className="mb-6">
          <h3 className="text-xl text-charcoal" style={{ fontFamily: "var(--font-display)" }}>
            Typography
          </h3>
          <p className="text-sm text-charcoal-light mt-1" style={{ fontFamily: "var(--font-body)" }}>
            Select the fonts for headings and body text.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
              Heading Font
            </label>
            <select
              value={headingFont}
              onChange={(e) => setHeadingFont(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-warm-50 border border-warm-200 text-charcoal focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all text-sm"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {HEADING_FONTS.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
            <div className="mt-3 p-4 rounded-xl bg-warm-50 border border-warm-200">
              <p className="text-2xl text-charcoal" style={{ fontFamily: `'${headingFont}', Georgia, serif` }}>
                The quick brown fox
              </p>
              <p className="text-sm text-charcoal-light mt-1" style={{ fontFamily: "var(--font-body)" }}>
                {headingFont}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
              Body Font
            </label>
            <select
              value={bodyFont}
              onChange={(e) => setBodyFont(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-warm-50 border border-warm-200 text-charcoal focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all text-sm"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {BODY_FONTS.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
            <div className="mt-3 p-4 rounded-xl bg-warm-50 border border-warm-200">
              <p className="text-base text-charcoal" style={{ fontFamily: `'${bodyFont}', system-ui, sans-serif` }}>
                The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.
              </p>
              <p className="text-sm text-charcoal-light mt-1" style={{ fontFamily: "var(--font-body)" }}>
                {bodyFont}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="pill-primary gap-2"
        >
          {updateMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Theme
        </button>
        <button
          onClick={handleReset}
          disabled={resetMutation.isPending || isDefault}
          className="pill-outline gap-2"
          style={{ opacity: isDefault ? 0.5 : 1 }}
        >
          {resetMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RotateCcw className="w-4 h-4" />
          )}
          Reset to Default
        </button>
      </div>
    </div>
  );
}

// ============================================================
// LAYOUT TAB
// ============================================================
const SECTION_LABELS: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  hero: { label: "Hero", icon: User },
  about: { label: "About", icon: User },
  projects: { label: "Projects", icon: FolderOpen },
  skills: { label: "Skills", icon: Wrench },
  experience: { label: "Experience", icon: Briefcase },
  education: { label: "Education", icon: GraduationCap },
  contact: { label: "Contact", icon: Eye },
};

const DEFAULT_SECTION_ORDER = "hero,about,projects,skills,experience,education,contact";

function SortableSectionItem({ id, index, total, onMoveUp, onMoveDown }: {
  id: string;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto" as any,
  };

  const meta = SECTION_LABELS[id] || { label: id, icon: LayoutGrid };
  const Icon = meta.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
        isDragging
          ? "bg-terracotta/5 border-terracotta/30 shadow-lg"
          : "bg-white border-warm-200/60 hover:border-warm-300"
      }`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-1.5 rounded-lg hover:bg-warm-100 transition-colors cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-charcoal-light" />
      </button>

      {/* Section info */}
      <div className="flex items-center gap-3 flex-1">
        <div className="w-9 h-9 rounded-xl bg-terracotta/8 flex items-center justify-center">
          <Icon className="w-4 h-4 text-terracotta" />
        </div>
        <div>
          <span className="text-sm font-medium text-charcoal" style={{ fontFamily: "var(--font-body)" }}>
            {meta.label}
          </span>
          <span className="text-xs text-charcoal-light ml-2" style={{ fontFamily: "var(--font-body)" }}>
            #{index + 1}
          </span>
        </div>
      </div>

      {/* Arrow buttons for manual reorder */}
      <div className="flex items-center gap-1">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-1.5 rounded-lg hover:bg-warm-100 transition-colors disabled:opacity-30"
          title="Move up"
        >
          <ArrowUp className="w-3.5 h-3.5 text-charcoal-light" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="p-1.5 rounded-lg hover:bg-warm-100 transition-colors disabled:opacity-30"
          title="Move down"
        >
          <ArrowDown className="w-3.5 h-3.5 text-charcoal-light" />
        </button>
      </div>
    </div>
  );
}

const COMBINED_GROUP_IDS = new Set(["skills", "experience", "education"]);

/**
 * In combined mode, we show a grouped view:
 * - Non-combined sections are individually sortable
 * - Skills/Experience/Education appear as a single grouped block
 * The grouped block's position is determined by the first combined section in the order.
 */
function buildGroupedOrder(sectionOrder: string[]): { id: string; isGroup: boolean }[] {
  const result: { id: string; isGroup: boolean }[] = [];
  let groupInserted = false;
  for (const s of sectionOrder) {
    if (COMBINED_GROUP_IDS.has(s)) {
      if (!groupInserted) {
        result.push({ id: "__combined_group__", isGroup: true });
        groupInserted = true;
      }
    } else {
      result.push({ id: s, isGroup: false });
    }
  }
  return result;
}

/**
 * Convert grouped order back to flat section order.
 * The combined group expands to skills,experience,education in their original relative order.
 */
function ungroupOrder(groupedOrder: { id: string; isGroup: boolean }[], originalOrder: string[]): string[] {
  const combinedSections = originalOrder.filter((s) => COMBINED_GROUP_IDS.has(s));
  const result: string[] = [];
  for (const item of groupedOrder) {
    if (item.isGroup) {
      result.push(...combinedSections);
    } else {
      result.push(item.id);
    }
  }
  return result;
}

function SortableGroupItem({ id, label, icon: Icon, index, total, onMoveUp, onMoveDown, isGroup, groupItems }: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isGroup?: boolean;
  groupItems?: string[];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto" as any,
  };

  if (isGroup) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`rounded-2xl border-2 transition-all ${
          isDragging
            ? "border-terracotta/40 bg-terracotta/5 shadow-lg"
            : "border-terracotta/20 bg-terracotta/[0.03] hover:border-terracotta/30"
        }`}
      >
        {/* Group header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-terracotta/10">
          <button
            {...attributes}
            {...listeners}
            className="p-1.5 rounded-lg hover:bg-terracotta/10 transition-colors cursor-grab active:cursor-grabbing touch-none"
            aria-label="Drag group to reorder"
          >
            <GripVertical className="w-4 h-4 text-terracotta" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-terracotta" style={{ fontFamily: "var(--font-body)" }}>
              Combined Pill Tabs
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta font-medium">
              Grouped
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onMoveUp}
              disabled={index === 0}
              className="p-1.5 rounded-lg hover:bg-terracotta/10 transition-colors disabled:opacity-30"
              title="Move group up"
            >
              <ArrowUp className="w-3.5 h-3.5 text-terracotta" />
            </button>
            <button
              onClick={onMoveDown}
              disabled={index === total - 1}
              className="p-1.5 rounded-lg hover:bg-terracotta/10 transition-colors disabled:opacity-30"
              title="Move group down"
            >
              <ArrowDown className="w-3.5 h-3.5 text-terracotta" />
            </button>
          </div>
        </div>
        {/* Group children */}
        <div className="px-4 py-3 space-y-1.5">
          {(groupItems || []).map((childId) => {
            const meta = SECTION_LABELS[childId] || { label: childId, icon: LayoutGrid };
            const ChildIcon = meta.icon;
            return (
              <div key={childId} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/60 border border-warm-200/40">
                <div className="w-7 h-7 rounded-lg bg-terracotta/8 flex items-center justify-center">
                  <ChildIcon className="w-3.5 h-3.5 text-terracotta" />
                </div>
                <span className="text-sm text-charcoal" style={{ fontFamily: "var(--font-body)" }}>
                  {meta.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
        isDragging
          ? "bg-terracotta/5 border-terracotta/30 shadow-lg"
          : "bg-white border-warm-200/60 hover:border-warm-300"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1.5 rounded-lg hover:bg-warm-100 transition-colors cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-charcoal-light" />
      </button>
      <div className="flex items-center gap-3 flex-1">
        <div className="w-9 h-9 rounded-xl bg-terracotta/8 flex items-center justify-center">
          <Icon className="w-4 h-4 text-terracotta" />
        </div>
        <div>
          <span className="text-sm font-medium text-charcoal" style={{ fontFamily: "var(--font-body)" }}>
            {label}
          </span>
          <span className="text-xs text-charcoal-light ml-2" style={{ fontFamily: "var(--font-body)" }}>
            #{index + 1}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-1.5 rounded-lg hover:bg-warm-100 transition-colors disabled:opacity-30"
          title="Move up"
        >
          <ArrowUp className="w-3.5 h-3.5 text-charcoal-light" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="p-1.5 rounded-lg hover:bg-warm-100 transition-colors disabled:opacity-30"
          title="Move down"
        >
          <ArrowDown className="w-3.5 h-3.5 text-charcoal-light" />
        </button>
      </div>
    </div>
  );
}

function LayoutTab() {
  const utils = trpc.useUtils();
  const { data: theme, isLoading } = trpc.adminTheme.get.useQuery();
  const updateMutation = trpc.adminTheme.update.useMutation({
    onSuccess: () => {
      utils.adminTheme.get.invalidate();
      utils.theme.get.invalidate();
      toast.success("Layout updated!");
    },
    onError: (err) => toast.error(err.message),
  });

  const [layoutMode, setLayoutMode] = useState<"separate" | "combined">("separate");
  const [sectionOrder, setSectionOrder] = useState<string[]>(
    DEFAULT_SECTION_ORDER.split(",")
  );
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (theme && !initialized) {
      setLayoutMode((theme.layoutMode as "separate" | "combined") || "separate");
      const order = theme.sectionOrder || DEFAULT_SECTION_ORDER;
      setSectionOrder(order.split(",").map((s: string) => s.trim()).filter(Boolean));
      setInitialized(true);
    }
  }, [theme, initialized]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const isCombined = layoutMode === "combined";

  // Build the display order based on mode
  const groupedOrder = isCombined ? buildGroupedOrder(sectionOrder) : null;
  const displayItems = isCombined
    ? (groupedOrder || []).map((g) => g.id)
    : sectionOrder;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    if (isCombined && groupedOrder) {
      const oldIndex = displayItems.indexOf(active.id as string);
      const newIndex = displayItems.indexOf(over.id as string);
      const newGrouped = arrayMove(groupedOrder, oldIndex, newIndex);
      setSectionOrder(ungroupOrder(newGrouped, sectionOrder));
    } else {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over.id as string);
      setSectionOrder(arrayMove(sectionOrder, oldIndex, newIndex));
    }
  };

  const moveSectionGrouped = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (!groupedOrder || newIndex < 0 || newIndex >= groupedOrder.length) return;
    const newGrouped = arrayMove(groupedOrder, index, newIndex);
    setSectionOrder(ungroupOrder(newGrouped, sectionOrder));
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    if (isCombined) {
      moveSectionGrouped(index, direction);
    } else {
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= sectionOrder.length) return;
      setSectionOrder(arrayMove(sectionOrder, index, newIndex));
    }
  };

  const handleSave = () => {
    updateMutation.mutate({
      layoutMode,
      sectionOrder: sectionOrder.join(","),
    });
  };

  const handleReset = () => {
    setLayoutMode("separate");
    setSectionOrder(DEFAULT_SECTION_ORDER.split(","));
  };

  const isDefault =
    layoutMode === "separate" &&
    sectionOrder.join(",") === DEFAULT_SECTION_ORDER;

  if (isLoading) return <LoadingSpinner />;

  // Get the combined group items for display
  const combinedGroupItems = sectionOrder.filter((s) => COMBINED_GROUP_IDS.has(s));

  return (
    <div className="space-y-8">
      {/* Layout Mode Toggle */}
      <div className="warm-card p-6 md:p-8">
        <h3 className="text-xl text-charcoal mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Layout Mode
        </h3>
        <p className="text-sm text-charcoal-light mb-6" style={{ fontFamily: "var(--font-body)" }}>
          Choose how Skills, Experience, and Education sections are displayed.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Separate option */}
          <button
            onClick={() => setLayoutMode("separate")}
            className={`p-5 rounded-2xl border-2 transition-all text-left ${
              layoutMode === "separate"
                ? "border-terracotta bg-terracotta/5 shadow-[0_2px_12px_var(--accent-hex,#B85C38)20]"
                : "border-warm-200/60 hover:border-warm-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                layoutMode === "separate" ? "bg-terracotta/15" : "bg-warm-100"
              }`}>
                <LayoutGrid className={`w-5 h-5 ${
                  layoutMode === "separate" ? "text-terracotta" : "text-charcoal-light"
                }`} />
              </div>
              <div>
                <span className="text-sm font-semibold text-charcoal block" style={{ fontFamily: "var(--font-body)" }}>
                  Separate Sections
                </span>
                <span className="text-xs text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>
                  Default layout
                </span>
              </div>
            </div>
            <p className="text-xs text-charcoal-light leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              Skills, Experience, and Education are shown as individual full-width sections with their own headers.
            </p>
            <div className="mt-4 space-y-1.5">
              <div className="h-2 rounded-full bg-warm-200 w-full" />
              <div className="h-2 rounded-full bg-warm-200 w-full" />
              <div className="h-2 rounded-full bg-warm-200 w-full" />
            </div>
          </button>

          {/* Combined option */}
          <button
            onClick={() => setLayoutMode("combined")}
            className={`p-5 rounded-2xl border-2 transition-all text-left ${
              layoutMode === "combined"
                ? "border-terracotta bg-terracotta/5 shadow-[0_2px_12px_var(--accent-hex,#B85C38)20]"
                : "border-warm-200/60 hover:border-warm-300 bg-white"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                layoutMode === "combined" ? "bg-terracotta/15" : "bg-warm-100"
              }`}>
                <Wrench className={`w-5 h-5 ${
                  layoutMode === "combined" ? "text-terracotta" : "text-charcoal-light"
                }`} />
              </div>
              <div>
                <span className="text-sm font-semibold text-charcoal block" style={{ fontFamily: "var(--font-body)" }}>
                  Combined Pill Tabs
                </span>
                <span className="text-xs text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>
                  Compact layout
                </span>
              </div>
            </div>
            <p className="text-xs text-charcoal-light leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              Skills, Experience, and Education are merged into one section with pill-tab navigation to switch between them.
            </p>
            <div className="mt-4">
              <div className="flex gap-1.5 mb-2">
                <div className="h-2 rounded-full bg-terracotta w-12" />
                <div className="h-2 rounded-full bg-warm-200 w-16" />
                <div className="h-2 rounded-full bg-warm-200 w-14" />
              </div>
              <div className="h-2 rounded-full bg-warm-200 w-full" />
            </div>
          </button>
        </div>
      </div>

      {/* Section Arrangement */}
      <div className="warm-card p-6 md:p-8">
        <h3 className="text-xl text-charcoal mb-2" style={{ fontFamily: "var(--font-display)" }}>
          Section Arrangement
        </h3>
        <p className="text-sm text-charcoal-light mb-6" style={{ fontFamily: "var(--font-body)" }}>
          {isCombined
            ? "Drag and drop to reorder sections. Skills, Experience, and Education move as a group."
            : "Drag and drop or use arrows to reorder sections on your portfolio page."
          }
        </p>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={displayItems} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {isCombined && groupedOrder
                ? groupedOrder.map((item, index) => {
                    if (item.isGroup) {
                      return (
                        <SortableGroupItem
                          key="__combined_group__"
                          id="__combined_group__"
                          label="Combined Pill Tabs"
                          icon={Wrench}
                          index={index}
                          total={groupedOrder.length}
                          onMoveUp={() => moveSection(index, "up")}
                          onMoveDown={() => moveSection(index, "down")}
                          isGroup
                          groupItems={combinedGroupItems}
                        />
                      );
                    }
                    const meta = SECTION_LABELS[item.id] || { label: item.id, icon: LayoutGrid };
                    return (
                      <SortableGroupItem
                        key={item.id}
                        id={item.id}
                        label={meta.label}
                        icon={meta.icon}
                        index={index}
                        total={groupedOrder.length}
                        onMoveUp={() => moveSection(index, "up")}
                        onMoveDown={() => moveSection(index, "down")}
                      />
                    );
                  })
                : sectionOrder.map((sectionId, index) => (
                    <SortableSectionItem
                      key={sectionId}
                      id={sectionId}
                      index={index}
                      total={sectionOrder.length}
                      onMoveUp={() => moveSection(index, "up")}
                      onMoveDown={() => moveSection(index, "down")}
                    />
                  ))
              }
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Save / Reset */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="pill-primary gap-2"
        >
          {updateMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Layout
        </button>
        <button
          onClick={handleReset}
          disabled={isDefault}
          className="pill-outline gap-2"
          style={{ opacity: isDefault ? 0.5 : 1 }}
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN ADMIN PAGE
// ============================================================
// ============================================================
// ANALYTICS TAB
// ============================================================
function AnalyticsTab() {
  const { data: analytics, isLoading } = trpc.adminAnalytics.summary.useQuery();
  const { data: projects } = trpc.adminProjects.list.useQuery();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const { data: detail } = trpc.adminAnalytics.detail.useQuery(
    { projectId: selectedProject! },
    { enabled: !!selectedProject }
  );

  if (isLoading) return <LoadingSpinner />;

  // Build project name map
  const projectMap: Record<number, string> = {};
  projects?.forEach((p) => { projectMap[p.id] = p.title; });

  // Total stats
  const totalClicks = analytics?.reduce((sum, a) => sum + a.clicks, 0) || 0;
  const totalViews = analytics?.reduce((sum, a) => sum + a.views, 0) || 0;

  // Sort by most clicks
  const sorted = [...(analytics || [])].sort((a, b) => b.clicks - a.clicks);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="warm-card p-6 text-center">
          <MousePointerClick className="w-8 h-8 text-terracotta mx-auto mb-2" />
          <p className="text-3xl font-bold text-charcoal" style={{ fontFamily: "var(--font-display)" }}>{totalClicks}</p>
          <p className="text-sm text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>Total Clicks</p>
        </div>
        <div className="warm-card p-6 text-center">
          <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-charcoal" style={{ fontFamily: "var(--font-display)" }}>{totalViews}</p>
          <p className="text-sm text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>Total Views</p>
        </div>
        <div className="warm-card p-6 text-center">
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-charcoal" style={{ fontFamily: "var(--font-display)" }}>{sorted.length}</p>
          <p className="text-sm text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>Projects Tracked</p>
        </div>
      </div>

      {/* Per-Project Breakdown */}
      <div className="warm-card p-6">
        <h3 className="text-lg text-charcoal mb-4" style={{ fontFamily: "var(--font-display)" }}>Project Engagement</h3>
        {sorted.length === 0 ? (
          <div className="text-center py-8 text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>
            <BarChart3 className="w-10 h-10 mx-auto mb-3 text-warm-300" />
            <p>No analytics data yet. Clicks on your project links will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((item) => {
              const maxClicks = sorted[0]?.clicks || 1;
              const barWidth = Math.max(5, (item.clicks / maxClicks) * 100);
              return (
                <button
                  key={item.projectId}
                  onClick={() => setSelectedProject(selectedProject === item.projectId ? null : item.projectId)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedProject === item.projectId
                      ? "bg-terracotta/5 border-2 border-terracotta/30"
                      : "bg-warm-50 border border-warm-200 hover:border-warm-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-charcoal truncate" style={{ fontFamily: "var(--font-body)" }}>
                      {projectMap[item.projectId] || `Project #${item.projectId}`}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-charcoal-light flex-shrink-0" style={{ fontFamily: "var(--font-body)" }}>
                      <span className="flex items-center gap-1">
                        <MousePointerClick className="w-3 h-3" />
                        {item.clicks}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.views}
                      </span>
                    </div>
                  </div>
                  {/* Bar chart */}
                  <div className="h-2 rounded-full bg-warm-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-terracotta transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selectedProject && detail && (
        <div className="warm-card p-6">
          <h3 className="text-lg text-charcoal mb-4" style={{ fontFamily: "var(--font-display)" }}>
            {projectMap[selectedProject] || `Project #${selectedProject}`} — Detail
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-warm-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-terracotta" style={{ fontFamily: "var(--font-display)" }}>{detail.totalClicks}</p>
              <p className="text-xs text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>Clicks</p>
            </div>
            <div className="bg-warm-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-500" style={{ fontFamily: "var(--font-display)" }}>{detail.totalViews}</p>
              <p className="text-xs text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>Views</p>
            </div>
          </div>
          {detail.events.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-charcoal mb-2" style={{ fontFamily: "var(--font-body)" }}>Recent Events</h4>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {detail.events.slice(0, 20).map((event) => (
                  <div key={event.id} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-warm-50">
                    <span className={`font-medium ${event.eventType === 'click' ? 'text-terracotta' : 'text-blue-500'}`}>
                      {event.eventType === 'click' ? '🖱 Click' : '👁 View'}
                    </span>
                    <span className="text-charcoal-light">
                      {new Date(event.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "layout", label: "Layout", icon: LayoutGrid },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "theme", label: "Theme", icon: Palette },
];

export default function Admin() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center grain-overlay">
        <div className="warm-card p-8 md:p-12 text-center max-w-md">
          <User className="w-12 h-12 text-terracotta mx-auto mb-4" />
          <h2 className="text-2xl text-charcoal mb-3" style={{ fontFamily: "var(--font-display)" }}>Admin Access Required</h2>
          <p className="text-charcoal-light mb-6" style={{ fontFamily: "var(--font-body)" }}>
            Sign in with your admin account to manage your portfolio content.
          </p>
          <a href={getLoginUrl("/admin")} className="pill-primary gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            Sign in with GitHub
          </a>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center grain-overlay">
        <div className="warm-card p-8 md:p-12 text-center max-w-md">
          <User className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl text-charcoal mb-3" style={{ fontFamily: "var(--font-display)" }}>Access Denied</h2>
          <p className="text-charcoal-light mb-6" style={{ fontFamily: "var(--font-body)" }}>
            You don't have admin permissions. Only the portfolio owner can manage content.
          </p>
          <a href="/" className="pill-outline gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grain-overlay">
      {/* Header */}
      <header className="bg-cream/80 backdrop-blur-xl border-b border-warm-200 sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <a href="/" className="p-2 rounded-full hover:bg-warm-100 transition-colors" title="Back to portfolio">
              <ArrowLeft className="w-5 h-5 text-charcoal" />
            </a>
            <h1 className="text-xl text-charcoal" style={{ fontFamily: "var(--font-display)" }}>
              Admin Dashboard
            </h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-warm-100 transition-colors"
            >
              {(user as any)?.avatarUrl ? (
                <img src={(user as any).avatarUrl} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-terracotta" />
                </div>
              )}
              <span className="text-sm text-charcoal-light hidden sm:block" style={{ fontFamily: "var(--font-body)" }}>
                {user?.name || user?.email || "Admin"}
              </span>
              <ChevronDown className={`w-4 h-4 text-charcoal-light transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`} />
            </button>
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-warm-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-warm-100">
                    <p className="text-sm font-medium text-charcoal truncate" style={{ fontFamily: "var(--font-body)" }}>
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-charcoal-light truncate" style={{ fontFamily: "var(--font-body)" }}>
                      {user?.email || ""}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-terracotta text-white shadow-[0_2px_12px_oklch(0.55_0.14_35/0.3)]"
                    : "bg-warm-100 text-charcoal-light border border-warm-200/60 hover:border-terracotta-light hover:text-terracotta-dark"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "experience" && <ExperienceTab />}
        {activeTab === "skills" && <SkillsTab />}
        {activeTab === "education" && <EducationTab />}
        {activeTab === "layout" && <LayoutTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "theme" && <ThemeTab />}
      </div>
    </div>
  );
}
