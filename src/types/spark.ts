export type Eligibility = {
sectorFit: boolean;
incorporationBySept2024: boolean;
recurringRevenue12m: boolean;
techAndSustainability: boolean;
independentOwnership: boolean;
willingToPartnerWithNord: boolean;
};


export type ImpactMetric = { name: string; baseline: number; current: number; unit: string };


export interface SparkApplication {
id?: string;
createdAt?: number; // epoch ms
status: 'submitted' | 'in_review' | 'shortlisted' | 'rejected' | 'winner';
acceptTerms: boolean;
eligibility: Eligibility;


applicantName: string;
applicantEmail: string;
applicantPhone: string;


companyName: string;
registeredAddress: string;
oneLiner: string;
sector: 'production'|'venues'|'logistics'|'virtual_hybrid'|'hospitality'|'other';
incorporationDate: string; // ISO
website?: string;
socialLinks?: string[];


problemSolution: string;
vision5y: string;
sdgs: string[];
impactMetrics: ImpactMetric[];


businessModel: string;
revenueStreams: { name: string; pricing: string }[];


last12moRevenueBracket: '0-10k'|'10k-50k'|'50k-200k'|'200k-1m'|'1m+';
femaleFounder?: boolean;
team: string;
advisors?: string;


willingToPartnerWithNord: boolean;


uploads: {
slideDeckUrl: string;
slideDeckName: string;
slideDeckSize: number;
};


audit: {
ip?: string;
ua?: string;
};
}