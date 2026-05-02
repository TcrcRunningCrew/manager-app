import { cn } from "@/lib/utils";

interface RankingCardProps {
  userRanking: number | undefined;
  allRank: number | undefined;
  bgColor?: string;
}

export function RankingCard({ userRanking, allRank, bgColor = "bg-tcrc-accent" }: RankingCardProps) {
  return (
    <div className="p-3">
      <div
        className={cn(
          "rounded-tcrc-lg p-4 mx-auto w-full sm:w-3/4 md:w-3/4 lg:w-2/3 xl:w-1/2",
          bgColor
        )}
      >
        <div className="flex items-center justify-between">
          <div className="font-bold text-white text-tcrc-body p-2 pl-5">
            나의 랭킹
          </div>
          {userRanking ? (
            <div className="text-white text-tcrc-body p-2 pr-11">
              {userRanking}위(전체{allRank})
            </div>
          ) : (
            <div className="font-bold text-white text-tcrc-body p-2 pr-8">
              랭킹없음
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
