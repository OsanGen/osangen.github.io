const Resume = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 bg-background font-sans">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold font-heading mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-accent">
                    CV / Resume
                </h1>

                <div className="space-y-12">

                    {/* Summary */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold border-b border-border pb-2 text-brand-accent">Professional Summary</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            Strategic marketing to drive business growth and audience engagement. Skilled in developing scalable, innovative initiatives that enhance brand awareness and operational efficiency across global markets. Combines expertise in data strategy, cross-functional collaboration, and market insights to create impactful solutions. Passionate about leveraging AI and data to uncover new opportunities, improve decision-making, and drive meaningful results.
                        </p>
                    </section>

                    {/* Education */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold border-b border-border pb-2 text-brand-accent">Education</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-foreground">B.B.A. in Marketing</h3>
                                <p className="text-brand-primary font-medium">Isenberg School of Management, University of Massachusetts Amherst — Amherst, MA</p>
                                <p className="text-sm text-muted-foreground mb-2">Graduation: May 2025</p>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                                    <li><strong>Relevant Coursework:</strong> Marketing Analytics, Digital Marketing Strategy, Consumer Behavior, Data Mining & Visualization, Statistical Analysis for Business Decisions</li>
                                    <li><strong>Honors & Activities:</strong> Marketing Club, Data Analytics Student Association, Dean’s List</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">MIT Professional Education</h3>
                                <p className="text-brand-primary font-medium">Applied Generative AI for Digital Transformation, Certificate of Completion</p>
                                <p className="text-sm text-muted-foreground mb-2">Cambridge, MA (Live Virtual Course) 2025</p>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                                    <li>Completed intensive three‑week program (64 hrs) led by MIT faculty, covering neural networks, autoencoders, latent‑space generation, and GitHub Copilot integration.</li>
                                    <li>Mastered ChatGPT architecture, prompt engineering, browser‑extension development, plugin implementation, and vector‑database retrieval workflows.</li>
                                    <li>Conducted analyses of real‑world generative‑AI use cases, assessing organizational readiness, bias‑mitigation strategies, and forecasting emerging trends.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Experience */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold border-b border-border pb-2 text-brand-accent">Professional Experience</h2>

                        <div className="space-y-8">
                            {/* Beautiful Patterns */}
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Co-Founder & Head of Marketing | Beautiful Patterns</h3>
                                <p className="text-sm text-brand-primary font-medium mb-1">Cambridge, MA & Monterrey, Mexico | June 2014 – Present</p>
                                <p className="text-sm mb-3"><a href="https://dreamers.mit.edu" target="_blank" className="text-brand-accent hover:underline">Dreamers.mit.edu</a></p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li><strong>Co-founded and led</strong> an interdisciplinary educational initiative to tackle the sociotechnical challenge of women’s STEM education—especially in computational fields—in the developing world. Launched a pilot in 2017, scaling it into a program recognized internationally for reaching over 10,000 participants annually across the U.S. and Mexico.</li>
                                    <li><strong>Developed a data-driven curriculum</strong> that blended engineering, computation, and social sciences to address real-world challenges (e.g., economics, energy, healthcare, and infrastructure). Incorporated practical “Design Patterns” (like cooking algorithms, packing optimization, and currency-search strategies) to make computational thinking more accessible and engaging for underrepresented girls.</li>
                                    <li><strong>Built and led a cross-functional team</strong> that leveraged digital tools to optimize instructional delivery, automate workflows, and inform decisions through data. Served as a full-time instructor, guiding participants through hands-on activities and fostering collaborative problem-solving skills.</li>
                                    <li><strong>Secured strategic partnerships</strong> with MIT, MISTI (MIT International Science and Technology Initiatives), and Tecnológico de Monterrey (ITESM), working closely with these institutions to refine and expand the program’s reach. Oversaw marketing, including graphic/web design, social media campaigns, and brand strategy to ensure cohesive outreach and maximize impact.</li>
                                </ul>
                            </div>

                            {/* Gen AI Global */}
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Founder & Head, Gen AI Global @MIT Professional Network</h3>
                                <p className="text-sm text-brand-primary font-medium mb-1">Cambridge, MA (Hybrid) | Jan 2024 – Present</p>
                                <p className="text-sm mb-3"><a href="https://www.linkedin.com/company/gen-ai-global/?viewAsMember=true" target="_blank" className="text-brand-accent hover:underline">LinkedIn Page</a></p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li>Built & led global generative‑AI community (0 → 1,000+ members in 4 weeks), engaging senior leaders from IBM, Accenture, Y Combinator; transitioned org to sustainable non‑profit structure.</li>
                                    <li>Oversee daily operations across all teams, systems, programming, and infrastructure, leveraging advanced AI tooling to streamline execution and management.</li>
                                    <li>Developed & led popular Gen AI education programs (Gen AI for Non‑Coders, Discord Agent Development), mentoring 10+ cohorts via flipped‑classroom & asynchronous learning models.</li>
                                    <li>Established & managed 12 volunteer‑driven departments (Agile Ops, Cybersecurity, Ethical AI, Fundraising), onboarding and coordinating 200+ volunteers; generated $4.1 M annualized ROI based on industry‑standard valuation of volunteer hours.</li>
                                    <li>Founded internal Agent Ops team creating open‑source automation agents, significantly enhancing community operations, moderation, onboarding, and knowledge‑management efficiency.</li>
                                    <li>Created AI‑driven automated content‑creation systems, growing LinkedIn followership by 2,500+ within 2 months.</li>
                                    <li>Led strategic AI integrations & multi‑platform engagement (WhatsApp → Discord), automating weekly content delivery ("Motivation Monday," "Tech Tip Tuesday") and expert‑led Q&A sessions.</li>
                                    <li>Orchestrated collaborations with MIT faculty & AI industry experts, expanding MIT Professional Education’s brand and community impact within the generative‑AI ecosystem.</li>
                                </ul>
                            </div>

                            {/* AIforAll Global */}
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Co‑Founder, AIforAll Global – Hybrid</h3>
                                <p className="text-sm text-brand-primary font-medium mb-1">Jun 2025 – Present</p>
                                <p className="text-sm mb-3"><a href="https://aiforallglobal.org" target="_blank" className="text-brand-accent hover:underline">aiforallglobal.org</a></p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li>Responsible for designing and leading the AI Changemakers Fellowship program.</li>
                                    <li>Build and maintain partnerships with global schools, NGOs, and youth organizations.</li>
                                    <li>Mentor and guide youth‑led AI projects focused on education, health, climate, and justice.</li>
                                    <li>Coordinate showcases, oversee publication of impact stories, and support the development of a global alumni network.</li>
                                    <li>Develop open‑access tools, community curricula, and manage microgrant distribution to support innovation initiatives.</li>
                                </ul>
                            </div>

                            {/* Broad Institute */}
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Data Visualization Intern & Frontend Developer | Broad Institute</h3>
                                <p className="text-sm text-brand-primary font-medium mb-2">Cambridge, MA (Multiple Projects: June 2015 – August 2017)</p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li><strong>Technical Innovation:</strong> Developed interactive web interfaces and a custom JS library to streamline genomic data analysis.</li>
                                    <li><strong>Robust Tool Integration:</strong> Engineered a Node.js application for dynamic query visualization, enhancing data accessibility.</li>
                                    <li><strong>Collaborative Execution:</strong> Worked with multidisciplinary teams to seamlessly integrate visualization tools into research workflows.</li>
                                </ul>
                            </div>

                            {/* Microsoft */}
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Summer Camp Instructor | Microsoft Corporation</h3>
                                <p className="text-sm text-brand-primary font-medium mb-2">Cambridge, MA | August 2016</p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li><strong>Inclusive Educational Design:</strong> Created and delivered computational thinking workshops for visually impaired/blind students.</li>
                                    <li><strong>Complex Concept Simplification:</strong> Translated algorithmic principles into accessible lessons, earning recognition for inclusivity.</li>
                                    <li>Received praise from coordinators for enhancing creative problem-solving skills among diverse learners.</li>
                                </ul>
                            </div>

                            {/* CSBXI */}
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Founder & Chief Executive Officer | CSBXI</h3>
                                <p className="text-sm text-brand-primary font-medium mb-2">Wellesley, MA | Jan 2018 – Aug 2018</p>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                    <li><strong>Strategic Initiative for Educational Equity:</strong> Founded CSBXI to fund and support Patrones Hermosas, expanding computational education for underrepresented communities.</li>
                                    <li><strong>Fundraising & Resource Mobilization:</strong> Spearheaded targeted campaigns, enabling over 1,000 students in Mexico to access quality programming education.</li>
                                    <li><strong>Curriculum Innovation & Expansion:</strong> Led computer science courses emphasizing practical, job-ready programming skills.</li>
                                    <li><strong>Cross-Cultural Outreach & Partnerships:</strong> Partnered with MIT-affiliated faculty and global education advocates to broaden Patrones Hermosas’s reach.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Technical Skills */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold border-b border-border pb-2 text-brand-accent">Technical Skills</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h4 className="font-bold text-foreground">Digital Marketing & Growth Strategy</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                    <li>Social Media Marketing (Instagram, TikTok, YouTube, Twitter)</li>
                                    <li>Paid Ad Campaign Management (Meta, Google Ads, TikTok Ads)</li>
                                    <li>SEO Optimization (On-page & Off-page)</li>
                                    <li>Content Strategy & Development</li>
                                    <li>Influencer Marketing & Outreach</li>
                                    <li>Community Engagement Strategies</li>
                                    <li>Copywriting & Conversion-Optimized Content</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-foreground">Data Analytics & Performance Optimization</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                    <li>Google Analytics & Digital Advertising Performance Analysis</li>
                                    <li>A/B Testing & Predictive Modeling</li>
                                    <li>Market Research & Competitor Analysis</li>
                                    <li>SQL Querying & Data Visualization (Tableau, D3.js, Plotly)</li>
                                    <li>Lead Generation & CRM Management (HubSpot, Klaviyo, Mailchimp)</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-foreground">Creative & Multimedia Content Production</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                    <li>Video Production & Editing (Adobe Premiere Pro, Final Cut Pro, After Effects)</li>
                                    <li>Motion Graphics & Visual Storytelling</li>
                                    <li>Audio Mixing & Podcast Editing</li>
                                    <li>Photography & Merchandise Design Coordination</li>
                                    <li>Live Stream Setup & Optimization</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-foreground">Web & Marketing Technology</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                    <li>Website Performance Optimization & UI/UX Principles</li>
                                    <li>Web Scraping & Automation (Python, JavaScript)</li>
                                    <li>API Integrations (Meta Ads API, Google Analytics API, Shopify API)</li>
                                    <li>E-commerce Store Setup & Sales Funnel Optimization (Shopify, Printful)</li>
                                    <li>Cloud Services & Serverless Functions (AWS, GCP, Azure)</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-foreground">Business & Project Management</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                    <li>Branding & Identity Development</li>
                                    <li>Timeline Preparation & Progress Monitoring</li>
                                    <li>Promotional Campaigns & Event Management</li>
                                    <li>Financial Budgeting & Forecasting</li>
                                    <li>Vendor & Product Testing</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-foreground">Languages & Communication</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground">
                                    <li>Fluent in English & Spanish (Bilingual Marketing & Content Creation)</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Extracurricular Activities */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold border-b border-border pb-2 text-brand-accent">Extracurricular Activities</h2>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li><strong>Freelance Videographer & Photographer</strong> – Created visuals for musicians, creatives, and brand campaigns.</li>
                            <li><strong>Audio Engineer</strong> – Mixed and mastered music/podcast projects, ensuring professional-grade sound.</li>
                            <li><strong>Web & Digital Infrastructure Assistant</strong> – Optimized e-commerce, websites, and digital distribution for artists.</li>
                            <li><strong>Creative & Tech Consultant</strong> – Provided strategies and solutions to enhance artist visibility and monetization.</li>
                        </ul>
                    </section>

                    {/* Additional Information */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold border-b border-border pb-2 text-brand-accent">Additional Information</h2>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                            <li>Passionate advocate for diversity in STEM and mentor to aspiring technologists.</li>
                            <li>Experienced in bilingual program delivery, expanding access and fostering global community engagement.</li>
                            <li>Committed to leveraging marketing analytics, data-driven decisions, and strategic partnerships for social impact.</li>
                        </ul>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Resume;
