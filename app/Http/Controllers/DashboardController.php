<?php

namespace App\Http\Controllers;

use App\Models\PpdbRegistration;
use App\Models\News;
use App\Models\User;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $data = $this->getDashboardData($request->query('year', date('Y')));
        return response()->json($data);
    }

    public function exportReport(Request $request)
    {
        $year = $request->query('year', date('Y'));
        $data = $this->getDashboardData($year);
        $data['year'] = $year;

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\DashboardReportExport($data), 
            'dashboard_report_' . $year . '.xlsx'
        );
    }

    private function getDashboardData($year)
    {

        // Overview Stats
        $totalPpdb = PpdbRegistration::whereYear('created_at', $year)->count();
        $newsPublished = News::where('status', 'published')->count();
        $newsDrafts = News::where('status', 'draft')->count();
        $totalUsers = User::count();
        $activeRoles = Role::count();

        // Chart Data: PPDB Registrations by Month
        $ppdbStats = PpdbRegistration::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(id) as count')
        )
        ->whereYear('created_at', $year)
        ->groupBy('month')
        ->orderBy('month')
        ->get()
        ->pluck('count', 'month')
        ->toArray();

        // Format chart data for all 12 months
        $chartData = [];
        for ($i = 1; $i <= 12; $i++) {
            $chartData[] = [
                'month' => date('M', mktime(0, 0, 0, $i, 1)),
                'count' => $ppdbStats[$i] ?? 0
            ];
        }

        // Recent Activity
        $recentActivities = collect();

        // Fetch recent PPDB registrations
        $recentPpdb = PpdbRegistration::latest()->take(5)->get()->map(function ($item) {
            return [
                'type' => 'ppdb',
                'title' => $item->full_name . ' mendaftar via PPDB Online.',
                'icon' => 'person_add',
                'color' => 'primary',
                'date' => $item->created_at
            ];
        });
        $recentActivities = $recentActivities->concat($recentPpdb);

        // Fetch recent News
        $recentNews = News::latest()->take(5)->get()->map(function ($item) {
            $statusText = $item->status === 'published' ? 'dipublikasi' : 'menunggu persetujuan';
            return [
                'type' => 'news',
                'title' => 'Berita "' . $item->title . '" ' . $statusText . '.',
                'icon' => 'edit_document',
                'color' => 'secondary',
                'date' => $item->created_at
            ];
        });
        $recentActivities = $recentActivities->concat($recentNews);

        // Fetch recent Contacts (Layanan Publik)
        $recentContacts = Contact::latest()->take(5)->get()->map(function ($item) {
            $statusText = $item->status === 'new' ? 'baru' : 'diperbarui';
            return [
                'type' => 'contact',
                'title' => 'Pesan ' . $statusText . ' dari ' . $item->name . '.',
                'icon' => 'mail',
                'color' => 'tertiary',
                'date' => $item->created_at
            ];
        });
        $recentActivities = $recentActivities->concat($recentContacts);

        // Sort by date DESC and take top 5
        $recentActivities = $recentActivities->sortByDesc('date')->take(6)->values()->all();

        // Attendance Stats by Class
        $attendanceStats = DB::table('attendances')
            ->join('meetings', 'attendances.meeting_id', '=', 'meetings.id')
            ->join('schedules', 'meetings.schedule_id', '=', 'schedules.id')
            ->join('classrooms', 'schedules.classroom_id', '=', 'classrooms.id')
            ->select('classrooms.name as class_name')
            ->selectRaw('COUNT(attendances.id) as total_attendance')
            ->selectRaw('SUM(CASE WHEN attendances.status = "present" THEN 1 ELSE 0 END) as present_count')
            ->whereYear('attendances.created_at', $year)
            ->groupBy('classrooms.id', 'classrooms.name')
            ->orderBy('classrooms.name')
            ->get()
            ->map(function ($item) {
                return [
                    'class_name' => $item->class_name,
                    'percentage' => $item->total_attendance > 0 ? round(($item->present_count / $item->total_attendance) * 100, 1) : 0,
                    'total' => $item->total_attendance,
                    'present' => $item->present_count
                ];
            });

        return [
            'stats' => [
                'total_ppdb' => $totalPpdb,
                'news_published' => $newsPublished,
                'news_drafts' => $newsDrafts,
                'total_users' => $totalUsers,
                'active_roles' => $activeRoles
            ],
            'chart' => $chartData,
            'recent_activities' => $recentActivities,
            'attendance_stats' => $attendanceStats
        ];
    }
}
