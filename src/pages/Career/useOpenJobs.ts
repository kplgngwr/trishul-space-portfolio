import { useEffect, useState } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface OpenJob {
    id: string;
    title: string;
    department: string | null;
    location: string | null;
    description: string;
    postedAt: string;
    applyUrl: string;
}

export interface JobDepartmentGroup {
    name: string;
    jobs: OpenJob[];
}

interface CareersResponse {
    jobs: OpenJob[];
}

type FetchStatus = 'loading' | 'success' | 'error';

interface UseOpenJobsResult {
    status: FetchStatus;
    departments: JobDepartmentGroup[];
}

// ============================================================================
// Constants
// ============================================================================

// Set in .env: VITE_CAREERS_API_URL_DEV / VITE_CAREERS_API_URL_PROD.
// The deployed hiring portal only allows CORS from https://trishulspace.com
// (and https://www.trishulspace.com), not localhost - that carve-out only
// applies when the hiring portal itself runs in dev mode. So in local dev
// this points at its local server instead - run the hiring portal repo with
// `pnpm run dev` on port 3000 for this to work.
const CAREERS_API_URL = import.meta.env.DEV
    ? import.meta.env.VITE_CAREERS_API_URL_DEV || 'http://localhost:3000/api/careers'
    : import.meta.env.VITE_CAREERS_API_URL_PROD || 'https://hiring.trishulspace.com/api/careers';
const UNSPECIFIED_DEPARTMENT = 'Other Openings';

// ============================================================================
// Helpers
// ============================================================================

function groupJobsByDepartment(jobs: OpenJob[]): JobDepartmentGroup[] {
    const groups = new Map<string, OpenJob[]>();

    for (const job of jobs) {
        const departmentName = job.department?.trim() || UNSPECIFIED_DEPARTMENT;
        const existing = groups.get(departmentName);
        if (existing) {
            existing.push(job);
        } else {
            groups.set(departmentName, [job]);
        }
    }

    return Array.from(groups.entries()).map(([name, groupJobs]) => ({ name, jobs: groupJobs }));
}

// ============================================================================
// Hook
// ============================================================================

/**
 * useOpenJobs Hook
 * @description Fetches open job postings from the hiring portal's public
 * careers API and groups them by department for rendering.
 */
export function useOpenJobs(): UseOpenJobsResult {
    const [status, setStatus] = useState<FetchStatus>('loading');
    const [departments, setDepartments] = useState<JobDepartmentGroup[]>([]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadJobs(): Promise<void> {
            try {
                const response = await fetch(CAREERS_API_URL, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error(`Failed to load open positions (${response.status})`);
                }

                const data: CareersResponse = await response.json();
                setDepartments(groupJobsByDepartment(data.jobs));
                setStatus('success');
            } catch (error) {
                if (controller.signal.aborted) return;
                setStatus('error');
            }
        }

        loadJobs();

        return () => controller.abort();
    }, []);

    return { status, departments };
}
