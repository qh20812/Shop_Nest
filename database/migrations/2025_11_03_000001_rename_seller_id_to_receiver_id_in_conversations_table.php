<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
	public function up(): void
	{
		$driver = Schema::getConnection()->getDriverName();

		Schema::table('conversations', function (Blueprint $table) use ($driver) {
			if (! Schema::hasColumn('conversations', 'seller_id')) {
				return;
			}

			// Drop constraints based on driver
			if ($driver === 'mysql') {
				// MySQL requires raw SQL to drop FKs
				DB::statement('ALTER TABLE conversations DROP FOREIGN KEY conversations_seller_id_foreign, DROP FOREIGN KEY conversations_user_id_foreign');
				$table->dropUnique('conversations_user_id_seller_id_unique');
				$table->dropIndex('conversations_user_id_seller_id_index');
				$table->dropIndex('conversations_seller_id_foreign');
			} else {
				// SQLite and others
				$table->dropForeign(['seller_id']);
				$table->dropForeign(['user_id']);
				$table->dropUnique('conversations_user_id_seller_id_unique');
				if ($driver !== 'sqlite') {
					$table->dropIndex('conversations_user_id_seller_id_index');
				}
			}

			$table->renameColumn('seller_id', 'receiver_id');
		});

		Schema::table('conversations', function (Blueprint $table) {
			if (! Schema::hasColumn('conversations', 'receiver_id')) {
				return;
			}

			$table->foreign('receiver_id')->references('id')->on('users')->cascadeOnDelete();
			$table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
			$table->unique(['user_id', 'receiver_id']);
			$table->index(['user_id', 'receiver_id']);
		});
	}    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        Schema::table('conversations', function (Blueprint $table) use ($driver) {
            if (Schema::hasColumn('conversations', 'receiver_id')) {
                // Drop constraints based on driver
                if ($driver === 'mysql') {
                    DB::statement('ALTER TABLE conversations DROP FOREIGN KEY conversations_receiver_id_foreign, DROP FOREIGN KEY conversations_user_id_foreign');
                    $table->dropUnique('conversations_user_id_receiver_id_unique');
                    $table->dropIndex('conversations_user_id_receiver_id_index');
                    $table->dropIndex('conversations_receiver_id_foreign');
                } else {
                    $table->dropForeign(['receiver_id']);
                    $table->dropForeign(['user_id']);
                    $table->dropUnique('conversations_user_id_receiver_id_unique');
                    if ($driver !== 'sqlite') {
                        $table->dropIndex('conversations_user_id_receiver_id_index');
                    }
                }

                $table->renameColumn('receiver_id', 'seller_id');
            }
        });

        Schema::table('conversations', function (Blueprint $table) {
            if (! Schema::hasColumn('conversations', 'seller_id')) {
                return;
            }

            $table->foreign('seller_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->unique(['user_id', 'seller_id']);
            $table->index(['user_id', 'seller_id']);
        });
    }
};
