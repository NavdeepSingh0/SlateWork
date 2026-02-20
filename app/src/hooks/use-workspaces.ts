import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Tag } from '@/types';
import { useAuth } from '@/store/AuthContext';

interface Workspace {
    id: string;
    name: string;
    description: string;
    status: string;
}

export function useWorkspaces() {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const { user } = useAuth();

    const fetchWorkspaces = useCallback(async () => {
        const { data: wsData } = await supabase.from('workspaces').select('*').eq('status', 'active');
        if (wsData) setWorkspaces(wsData);

        const { data: tagsData } = await supabase.from('tags').select('*');
        if (tagsData) {
            setTags(tagsData.map((t: any) => ({
                id: t.id,
                workspaceId: t.workspace_id,
                name: t.name,
                color: t.color,
            })));
        }
    }, []);

    useEffect(() => {
        fetchWorkspaces();
    }, [fetchWorkspaces]);

    const addWorkspace = async (name: string, description: string = '') => {
        if (!user) return null;
        const { data, error } = await supabase.from('workspaces').insert({
            name,
            description,
            created_by: user.id
        }).select().single();

        if (error) {
            console.error('Error adding workspace:', error);
            return null;
        }
        await fetchWorkspaces();
        return data;
    };

    return { workspaces, tags, refreshWorkspaces: fetchWorkspaces, addWorkspace };
}
