export class ByStatus {
    constructor(
        public totalBugs: number,
        public openBugs: number,
        public closedBugs: number,
        public activeBugs: number,
        public cancelledBugs: number,
        public closeWithoutOpeningBugs: number,
    ) {}
}
