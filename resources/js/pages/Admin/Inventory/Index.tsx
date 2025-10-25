import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "../../../layouts/app/AppLayout";

export default function Index() {
    return (
        <AppLayout>
            <Head title="Inventory Management" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
                <div className="bg-white rounded-lg shadow p-6">
                    <p>Inventory data loaded successfully.</p>
                </div>
            </div>
        </AppLayout>
    );
}