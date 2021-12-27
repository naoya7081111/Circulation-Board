export type CommunityMember = {
    userId: number;
    userName: string;
    userImageName: string | null;
    entryDate: Date;
    withdrawalDate: Date | null;
    communityId: number;
    isHost: boolean;
    sentence: string | null;
    area: string | null;
    site: string | null;
};