
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { approveUser } from "./actions";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Security Check: Hardcoded Admin Email Protection
    // Security Check: Hardcoded Admin Email Protection
    if (!user) {
        redirect('/login');
    }

    if (user.email !== 'fekupsony@gmail.com') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-600 font-bold p-10">
                Unauthorized Access. Admin only. <br />
                Current User: {user.email}
            </div>
        );
    }

    // Fetch pending approvals
    const { data: pendingUsers } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-slate-50 p-8 pt-32">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white">
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <span className="text-sm opacity-80">{user.email}</span>
                </div>

                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4">Pending Wholesaler Approvals</h2>

                    {pendingUsers && pendingUsers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-medium text-xs">
                                    <tr>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Role</th>
                                        <th className="px-6 py-3">Date Applied</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {pendingUsers.map((profile) => (
                                        <tr key={profile.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium">{profile.email}</td>
                                            <td className="px-6 py-4">{profile.role}</td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {new Date(profile.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <form action={approveUser.bind(null, profile.id)}>
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                        Approve
                                                    </Button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            No pending approvals found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
