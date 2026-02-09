export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface Vehicle {
    id: string;
    user_id: string;
    name: string;
    brand: string;
    model: string;
    year: number;
    license_plate: string;
    mileage?: number;
    purchase_date?: string;
    created_at: string;
    updated_at: string;
}

export interface Maintenance {
    id: string;
    type: 'mileage' | 'time' | 'one_time';
    description?: string;
    scheduled_date?: string;
    scheduled_mileage?: number;
    done: boolean;
    done_date?: string;
    done_mileage?: number;
    cost?: number;
    created_at: string;
    updated_at: string;
    // Relations
    vehicles?: Vehicle[];
    invoices?: Invoice[];
}

export interface AuthResponse {
    user: User;
    token: string;
    expires_in: number;
}

export interface Invoice {
    id: string;
    date: string;
    amount: number;
    description?: string;
    file_path?: string;
    created_at: string;
    updated_at: string;
    // Relations
    vehicles?: Vehicle[];
    maintenances?: Maintenance[];
}

export interface VehicleCountResponse {
    count: number;
    user_id?: string;
}

export interface DashboardData {
    vehicles: {
        count: number;
        list: Vehicle[];
    };
    maintenances: {
        upcoming: number;
        late: number;
    };
    invoices: {
        count: number;
    };
}
