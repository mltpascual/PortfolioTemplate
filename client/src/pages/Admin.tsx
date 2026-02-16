/*
 * Admin Dashboard for managing portfolio content.
 * Only accessible to users with admin role.
 * Tabs: Profile, Projects, Experience, Skills
 * Warm editorial design matching the portfolio theme.
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
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
} from "lucide-react";

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

  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    liveUrl: "",
    githubUrl: "",
    tags: "",
    featured: 0,
    displayMode: "live" as string,
    sortOrder: 0,
  });

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
      displayMode: project.displayMode || "live",
      sortOrder: project.sortOrder || 0,
    });
  };

  const startNew = () => {
    setEditing("new");
    setForm({ title: "", description: "", imageUrl: "", liveUrl: "", githubUrl: "", tags: "", featured: 0, displayMode: "live", sortOrder: (projects?.length || 0) + 1 });
  };

  const handleSave = () => {
    if (editing === "new") {
      createProject.mutate(form);
    } else if (typeof editing === "number") {
      updateProject.mutate({ id: editing, ...form });
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

      {editing !== null && (
        <div className="warm-card p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg text-charcoal" style={{ fontFamily: "var(--font-display)" }}>
              {editing === "new" ? "New Project" : "Edit Project"}
            </h3>
            <button onClick={() => setEditing(null)} className="p-1.5 rounded-full hover:bg-warm-100 transition-colors">
              <X className="w-4 h-4 text-charcoal-light" />
            </button>
          </div>
          <InputField label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Project name" />
          <TextareaField label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="What does this project do?" rows={3} />
          <InputField label="Image URL" value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} placeholder="https://..." />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Live URL" value={form.liveUrl} onChange={(v) => setForm({ ...form, liveUrl: v })} placeholder="https://..." />
            <InputField label="GitHub URL" value={form.githubUrl} onChange={(v) => setForm({ ...form, githubUrl: v })} placeholder="https://..." />
          </div>
          <InputField label="Tags (comma-separated)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} placeholder="React, TypeScript, Node.js" />
          <div className="grid grid-cols-3 gap-4">
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
            <div className="flex items-center gap-3 pt-6">
              <label className="text-sm font-medium text-charcoal" style={{ fontFamily: "var(--font-body)" }}>Display</label>
              <div className="flex rounded-full overflow-hidden border border-warm-200">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, displayMode: "live" })}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${form.displayMode === "live" ? "bg-terracotta text-white" : "bg-warm-50 text-charcoal-light hover:bg-warm-100"}`}
                >
                  Live
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, displayMode: "image" })}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${form.displayMode === "image" ? "bg-terracotta text-white" : "bg-warm-50 text-charcoal-light hover:bg-warm-100"}`}
                >
                  Image
                </button>
              </div>
            </div>
          </div>
          <button onClick={handleSave} disabled={createProject.isPending || updateProject.isPending} className="pill-primary gap-2">
            {(createProject.isPending || updateProject.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editing === "new" ? "Create Project" : "Update Project"}
          </button>
        </div>
      )}

      {/* Project List */}
      <div className="space-y-3">
        {projects?.map((project) => (
          <div key={project.id} className="warm-card p-4 flex items-center gap-4">
            <GripVertical className="w-4 h-4 text-warm-300 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-base text-charcoal truncate" style={{ fontFamily: "var(--font-display)" }}>
                  {project.title}
                </h4>
                {project.featured === 1 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-terracotta/10 text-terracotta font-medium">Featured</span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  project.displayMode === "image" ? "bg-warm-200/60 text-charcoal-light" : "bg-green-100 text-green-700"
                }`}>
                  {project.displayMode === "image" ? "Image" : "Live"}
                </span>
              </div>
              <p className="text-sm text-charcoal-light truncate" style={{ fontFamily: "var(--font-body)" }}>
                {project.description || "No description"}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => startEdit(project)} className="p-2 rounded-full hover:bg-warm-100 transition-colors" title="Edit">
                <Pencil className="w-4 h-4 text-charcoal-light" />
              </button>
              <button
                onClick={() => { if (confirm("Delete this project?")) deleteProject.mutate({ id: project.id }); }}
                className="p-2 rounded-full hover:bg-red-50 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ))}
        {(!projects || projects.length === 0) && (
          <div className="text-center py-12 text-charcoal-light" style={{ fontFamily: "var(--font-body)" }}>
            <FolderOpen className="w-10 h-10 mx-auto mb-3 text-warm-300" />
            <p>No projects yet. Add your first project above.</p>
          </div>
        )}
      </div>
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
  const [form, setForm] = useState({ role: "", company: "", period: "", description: "", tags: "", sortOrder: 0 });

  const startEdit = (exp: any) => {
    setEditing(exp.id);
    setForm({ role: exp.role || "", company: exp.company || "", period: exp.period || "", description: exp.description || "", tags: exp.tags || "", sortOrder: exp.sortOrder || 0 });
  };

  const startNew = () => {
    setEditing("new");
    setForm({ role: "", company: "", period: "", description: "", tags: "", sortOrder: (experiences?.length || 0) + 1 });
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

      {editing !== null && (
        <div className="warm-card p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg text-charcoal" style={{ fontFamily: "var(--font-display)" }}>{editing === "new" ? "New Experience" : "Edit Experience"}</h3>
            <button onClick={() => setEditing(null)} className="p-1.5 rounded-full hover:bg-warm-100 transition-colors"><X className="w-4 h-4 text-charcoal-light" /></button>
          </div>
          <InputField label="Role / Title" value={form.role} onChange={(v) => setForm({ ...form, role: v })} placeholder="Senior Software Engineer" />
          <InputField label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} placeholder="Company Name" />
          <InputField label="Period" value={form.period} onChange={(v) => setForm({ ...form, period: v })} placeholder="2023 — Present" />
          <TextareaField label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="What did you accomplish?" rows={3} />
          <InputField label="Tags (comma-separated)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} placeholder="React, TypeScript, Leadership" />
          <InputField label="Sort Order" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: parseInt(v) || 0 })} placeholder="1" />
          <button onClick={handleSave} disabled={createExp.isPending || updateExp.isPending} className="pill-primary gap-2">
            {(createExp.isPending || updateExp.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editing === "new" ? "Create" : "Update"}
          </button>
        </div>
      )}

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

      {editing !== null && (
        <div className="warm-card p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg text-charcoal" style={{ fontFamily: "var(--font-display)" }}>{editing === "new" ? "New Skill Category" : "Edit Category"}</h3>
            <button onClick={() => setEditing(null)} className="p-1.5 rounded-full hover:bg-warm-100 transition-colors"><X className="w-4 h-4 text-charcoal-light" /></button>
          </div>
          <InputField label="Category Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="e.g. Frontend" />
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
          <InputField label="Sort Order" value={String(form.sortOrder)} onChange={(v) => setForm({ ...form, sortOrder: parseInt(v) || 0 })} placeholder="1" />
          <button onClick={handleSave} disabled={createSkill.isPending || updateSkill.isPending} className="pill-primary gap-2">
            {(createSkill.isPending || updateSkill.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editing === "new" ? "Create" : "Update"}
          </button>
        </div>
      )}

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
    updateMutation.mutate({ accentColor, accentColorHover, headingFont, bodyFont, darkMode });
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
// MAIN ADMIN PAGE
// ============================================================
const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "theme", label: "Theme", icon: Palette },
];

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
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
          <div className="flex items-center gap-3">
            <span className="text-sm text-charcoal-light hidden sm:block" style={{ fontFamily: "var(--font-body)" }}>
              {user?.name || user?.email || "Admin"}
            </span>
            {(user as any)?.avatarUrl ? (
              <img src={(user as any).avatarUrl} alt="" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center">
                <User className="w-4 h-4 text-terracotta" />
              </div>
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
        {activeTab === "theme" && <ThemeTab />}
      </div>
    </div>
  );
}
