/*
 * DESIGN: Warm Monochrome Editorial
 * Staggered project cards with large images, warm shadows.
 * Pill-shaped tech tags. Asymmetric layout.
 */

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";

const PROJECT_1 = "https://private-us-east-1.manuscdn.com/sessionFile/td3PawS2CTYA7JoACPMNMZ/sandbox/l9YS4GhTwPQ9i9FbjWHhPd-img-3_1771203704000_na1fn_cHJvamVjdC0x.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdGQzUGF3UzJDVFlBN0pvQUNQTU5NWi9zYW5kYm94L2w5WVM0R2hUd1BROWk5RmJqV0hoUGQtaW1nLTNfMTc3MTIwMzcwNDAwMF9uYTFmbl9jSEp2YW1WamRDMHgucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Xy5-GXRfXw1f8BtDaru6CyLh8J9VpBpZMXbtB7D3jvfM9iSTH4wsSishiTlgs9I9d87mSlEuYL4ksamd7B22GegGwQx5~yrz0GgjH2nwLoYLjU86AGma2jkKc5IVFAzUJja1XJkdJdg6JUwOSFJlx06QMu5xMNCkYMt~RaskkWXhokwjJYay0w0kF-~~tRuJTTys6y~Mr0tQMisRZitf8AjJL9C7GOFdXJyoZeoc3VTF0~f4znCX9zHUBAlWyuDJ13HsjiZ2i6mAoIFZt3zKXVBj4P4RaKKuirO~AqbVnWPOc3mOrIr5vedMH1fHPKggaNotP3CBcScxO4OdgOsK7A__";
const PROJECT_2 = "https://private-us-east-1.manuscdn.com/sessionFile/td3PawS2CTYA7JoACPMNMZ/sandbox/l9YS4GhTwPQ9i9FbjWHhPd-img-4_1771203710000_na1fn_cHJvamVjdC0y.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdGQzUGF3UzJDVFlBN0pvQUNQTU5NWi9zYW5kYm94L2w5WVM0R2hUd1BROWk5RmJqV0hoUGQtaW1nLTRfMTc3MTIwMzcxMDAwMF9uYTFmbl9jSEp2YW1WamRDMHkucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=n0IcrukOPbuEI2DlAczd4Nch9AnQ-WN-8rGHFCyprvk2YAaJfdDDY7-64yM0n~JvgX6VujSDATsuagpK109PfwKwCS8x3kyu-yd-p1BfgtlU-h~vhO0zAm2V4r~L5Wkc6rBchWQWm538B5jWyZpK~NZTrkoWl0lJIdDTQpsQ-J3WZnqtBM1JbvCg9uiefDudxc6G6VypgF9SI5p4lw5bIvpqeJjYoN1oQn6SvbdfJz4s~-et-nzHzB7DNRuvwvGZr36K8c5s82AsSo9Lv4bLDSorNuTXlgPDdB07uiAZgV3U-lMVSqelQhyq51AnHldmjHn~6PXgOuDbIj~frAwRMQ__";
const PROJECT_3 = "https://private-us-east-1.manuscdn.com/sessionFile/td3PawS2CTYA7JoACPMNMZ/sandbox/l9YS4GhTwPQ9i9FbjWHhPd-img-5_1771203711000_na1fn_cHJvamVjdC0z.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdGQzUGF3UzJDVFlBN0pvQUNQTU5NWi9zYW5kYm94L2w5WVM0R2hUd1BROWk5RmJqV0hoUGQtaW1nLTVfMTc3MTIwMzcxMTAwMF9uYTFmbl9jSEp2YW1WamRDMHoucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=H09ciW7Xs3yE8FbMMpsWubzbTrpA6piUmstGRemk8KLKHi~MP1Ov2LaJxy862dj7K8PylIJJfS7qcWVrbHwx0BiLOdlVdUtsLmoNUZp8fhXwe-LrY5mrFEpnUIA-Wavm5fUG4V5v7X29rYyNtzGlLc-fvaVpfhmdvueaG2o1hxuq0aJR5VNDy6BLxeZY3nTl1yaxeW5Y4JXwedu1XoZ8Ts9jCbniFbGTNMRjiGbtWYmqZ8uppMBAB7MEfTPr~r7nhYwLO5EPk0Cw2CveUT1uIgFgVnk6oyiOBa0w67ci~HhECnEfJnL9S5z0p22DEde~0FQNcZoIIFFHV3yTZfPDHQ__";

const projects = [
  {
    title: "Analytics Dashboard",
    description:
      "A real-time analytics platform with interactive charts, custom reporting, and team collaboration features. Built for scale with server-side rendering and optimistic UI updates.",
    image: PROJECT_1,
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL", "D3.js"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    title: "Curenature Mobile App",
    description:
      "A lifestyle curation app with personalized content feeds, social sharing, and AI-powered recommendations. Designed with a focus on clean typography and intuitive navigation.",
    image: PROJECT_2,
    tags: ["React Native", "Expo", "Firebase", "TensorFlow Lite"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
  },
  {
    title: "CodeFlow Engine",
    description:
      "An open-source code visualization tool that transforms complex codebases into interactive flow diagrams. Helps teams understand architecture at a glance.",
    image: PROJECT_3,
    tags: ["Go", "WebAssembly", "Canvas API", "WebSocket"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
  },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="section-padding">
      <div className="container">
        {/* Section Header */}
        <div
          className={`mb-16 transition-all duration-600 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span
            className="text-sm font-semibold tracking-widest uppercase text-terracotta mb-4 block"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Selected Work
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2
              className="text-4xl md:text-5xl text-charcoal leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Projects I'm
              <br />
              <span className="text-terracotta italic">proud of.</span>
            </h2>
            <a href="#" className="pill-outline-sm self-start md:self-auto">
              View All Projects
            </a>
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-12">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className={`warm-card overflow-hidden transition-all duration-600 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${150 + i * 150}ms` }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                {/* Image */}
                <div
                  className={`lg:col-span-3 overflow-hidden ${
                    i % 2 !== 0 ? "lg:order-2" : ""
                  }`}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 lg:h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div
                  className={`lg:col-span-2 p-8 lg:p-10 flex flex-col justify-center ${
                    i % 2 !== 0 ? "lg:order-1" : ""
                  }`}
                >
                  {project.featured && (
                    <span
                      className="inline-flex self-start items-center px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-semibold mb-4"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Featured
                    </span>
                  )}
                  <h3
                    className="text-2xl md:text-3xl text-charcoal mb-3"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="text-charcoal-light leading-relaxed mb-6 text-sm md:text-base"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-warm-100 text-charcoal-light border border-warm-200/60"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-auto">
                    <a
                      href={project.liveUrl}
                      className="pill-primary-sm gap-2"
                    >
                      Live Demo
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                    <a
                      href={project.githubUrl}
                      className="p-2.5 rounded-full border border-warm-200 text-charcoal-light hover:text-terracotta hover:border-terracotta-light transition-all duration-200"
                      aria-label="View source code"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
