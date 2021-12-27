export type CommunityMembersSource = {
    communityid: number;
    entrydate: Date;
    withdrawaldate: Date | null;
    host: boolean;
    id: number;
    imagename: string | null;
    username: string;
    sentence: string | null;
    area: string | null;
    site: string | null;
}