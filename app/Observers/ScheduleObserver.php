<?php

namespace App\Observers;

use App\Models\Schedule;
use App\Models\Meeting;
use Carbon\Carbon;

class ScheduleObserver
{
    /**
     * Saat jadwal baru dibuat, otomatis buat 16 pertemuan (RTM) kosong.
     */
    public function created(Schedule $schedule): void
    {
        // Mapping day name to Carbon day number
        $dayMap = [
            'Senin'  => Carbon::MONDAY,
            'Selasa' => Carbon::TUESDAY,
            'Rabu'   => Carbon::WEDNESDAY,
            'Kamis'  => Carbon::THURSDAY,
            'Jumat'  => Carbon::FRIDAY,
            'Sabtu'  => Carbon::SATURDAY,
            'Minggu' => Carbon::SUNDAY,
        ];

        $dayNum = $dayMap[$schedule->day] ?? Carbon::MONDAY;

        // Mulai dari minggu depan terdekat sesuai hari jadwal
        $startDate = Carbon::now()->next($dayNum);

        $meetings = [];
        for ($i = 1; $i <= 16; $i++) {
            $meetings[] = [
                'schedule_id'    => $schedule->id,
                'meeting_number' => $i,
                'planned_date'   => $startDate->copy()->addWeeks($i - 1)->toDateString(),
                'type'           => 'Tatap Muka',
                'created_at'     => now(),
                'updated_at'     => now(),
            ];
        }

        Meeting::insert($meetings);
    }
}
