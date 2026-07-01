<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        table {
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #000000;
            padding: 8px;
            text-align: left;
            vertical-align: middle;
        }
        th {
            background-color: #d9e1f2;
            font-weight: bold;
        }
        .header {
            font-size: 14px;
            font-weight: bold;
            background-color: #4f81bd;
            color: #ffffff;
            text-align: center;
        }
        .title {
            font-size: 16px;
            font-weight: bold;
            text-align: center;
        }
    </style>
</head>
<body>
    <table>
        <tr>
            <td colspan="2" class="title">Laporan Ikhtisar Sistem Dashboard</td>
        </tr>
        <tr>
            <td colspan="2">Periode Tahun: {{ $data['year'] }}</td>
        </tr>
        <tr>
            <td colspan="2">Diekspor pada: {{ date('d-m-Y H:i:s') }}</td>
        </tr>
        <tr><td colspan="2"></td></tr>

        <!-- Ikhtisar -->
        <tr>
            <th colspan="2" class="header">1. Ikhtisar Statistik</th>
        </tr>
        <tr>
            <td>Total Pendaftar (PPDB)</td>
            <td>{{ $data['stats']['total_ppdb'] }}</td>
        </tr>
        <tr>
            <td>Berita Dipublikasi</td>
            <td>{{ $data['stats']['news_published'] }}</td>
        </tr>
        <tr>
            <td>Berita Menunggu Persetujuan (Draft)</td>
            <td>{{ $data['stats']['news_drafts'] }}</td>
        </tr>
        <tr>
            <td>Total Pengguna</td>
            <td>{{ $data['stats']['total_users'] }}</td>
        </tr>
        <tr>
            <td>Peran Aktif</td>
            <td>{{ $data['stats']['active_roles'] }}</td>
        </tr>
        <tr><td colspan="2"></td></tr>

        <!-- Grafik PPDB -->
        <tr>
            <th colspan="2" class="header">2. Statistik Pendaftaran PPDB per Bulan</th>
        </tr>
        <tr>
            <th>Bulan</th>
            <th>Jumlah Pendaftar</th>
        </tr>
        @foreach($data['chart'] as $chartItem)
        <tr>
            <td>{{ $chartItem['month'] }}</td>
            <td>{{ $chartItem['count'] }}</td>
        </tr>
        @endforeach
        <tr><td colspan="2"></td></tr>

        <!-- Aktivitas Terbaru -->
        <tr>
            <th colspan="2" class="header">3. Aktivitas Terbaru (Terakhir)</th>
        </tr>
        <tr>
            <th>Tanggal / Waktu</th>
            <th>Aktivitas</th>
        </tr>
        @foreach($data['recent_activities'] as $activity)
        <tr>
            <td>{{ \Carbon\Carbon::parse($activity['date'])->format('d-m-Y H:i:s') }}</td>
            <td>{{ strip_tags($activity['title']) }}</td>
        </tr>
        @endforeach
    </table>
</body>
</html>
