<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('chat_messages', function (Blueprint $table) {
            $table->string('role_context', 50)->nullable()->after('sender_id');
            $table->string('assistant_api', 50)->nullable()->after('role_context');
            $table->text('assistant_content')->nullable()->after('content');
            $table->json('context_snapshot')->nullable()->after('assistant_content');
            $table->json('assistant_metadata')->nullable()->after('context_snapshot');
            $table->unsignedInteger('response_latency_ms')->nullable()->after('assistant_metadata');
        });
    }

    public function down(): void
    {
        Schema::table('chat_messages', function (Blueprint $table) {
            $table->dropColumn([
                'role_context',
                'assistant_api',
                'assistant_content',
                'context_snapshot',
                'assistant_metadata',
                'response_latency_ms',
            ]);
        });
    }
};
