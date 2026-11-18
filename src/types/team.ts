export interface TeamMemberItem {
  id: string;
  name: string;
  role: string; // Designation
  specialty: string; // Title / Specialty (e.g. ENTERPRISE STRATEGY & BRAND ARCHITECTURE)
  bio: string; // Description
  image: string; // Picture URL
  department?: string;
  linkedin?: string | null;
  twitter?: string | null;
  featured?: boolean;
  order?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface TeamPageSettings {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const defaultTeamPageSettings: TeamPageSettings = {
  eyebrow: 'CROSS-FUNCTIONAL EXPERTISE',
  title: 'Behind the work are people who care about the outcome.',
  subtitle:
    'Our multidisciplinary leadership unifies brand architects, principal cloud engineers, data scientists, and talent strategists under one collaborative culture.',
};

