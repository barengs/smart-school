<?php

namespace App\Exports;

use App\Models\News;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class NewsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return News::with(['category', 'author', 'tags'])->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Judul',
            'Slug',
            'Kategori',
            'Penulis',
            'Tags',
            'Konten',
            'Status',
            'Tanggal Dibuat',
            'Tanggal Diperbarui'
        ];
    }

    public function map($news): array
    {
        $tags = $news->tags->pluck('name')->implode(', ');
        
        return [
            $news->id,
            $news->title,
            $news->slug,
            $news->category->name ?? '-',
            $news->author->name ?? '-',
            $tags,
            $news->content,
            $news->status,
            $news->created_at ? $news->created_at->format('Y-m-d H:i:s') : '-',
            $news->updated_at ? $news->updated_at->format('Y-m-d H:i:s') : '-'
        ];
    }
}
