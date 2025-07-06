import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class MonthService {
    private months: [number, string][] = [
        [1, 'ינואר'],
        [2, 'פברואר'],
        [3, 'מרץ'],
        [4, 'אפריל'],
        [5, 'מאי'],
        [6, 'יוני'],
        [7, 'יולי'],
        [8, 'אוגוסט'],
        [9, 'ספטמבר'],
        [10, 'אוקטובר'],
        [11, 'נובמבר'],
        [12, 'דצמבר']
    ];

    getMonths(): [number, string][] {
        return this.months;
    }

    getMonthNameByNumber(num: number): string | undefined {
        return this.months.find(m => m[0] === num)?.[1];
    }

    getMonthNumberByName(name: string): number | undefined {
        return this.months.find(m => m[1] === name)?.[0];
    }

    getMonthNames(): string[] {
        return this.months.map(m => m[1]);
    }

    getMonthNumbers(): number[] {
        return this.months.map(m => m[0]);
    }
}

@Injectable({
  providedIn: 'root'
})
export class YearService {
    private years: [number, string][];
    constructor() {
        const current = new Date().getFullYear();
        this.years = [];
        for (let y = current; y >= current - 10; y--) {
            this.years.push([y, y.toString()]);
        }
    }

    getYears(): [number, string][] {
        return this.years;
    }

    getYearNameByNumber(num: number): string | undefined {
        return this.years.find(y => y[0] === num)?.[1];
    }

    getYearNumberByName(name: string): number | undefined {
        return this.years.find(y => y[1] === name)?.[0];
    }

    getYearNames(): string[] {
        return this.years.map(y => y[1]);
    }

    getYearNumbers(): number[] {
        return this.years.map(y => y[0]);
    }
}