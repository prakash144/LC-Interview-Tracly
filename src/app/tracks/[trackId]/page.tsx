import { INTERVIEW_TRACKS } from "@/lib/interviewTracks";
import TrackDetailView from "@/app/components/tracks/TrackDetailView";

export function generateStaticParams() {
  return INTERVIEW_TRACKS.map((track) => ({
    trackId: track.id,
  }));
}

const TrackDetailPage = () => {
  return <TrackDetailView />;
};

export default TrackDetailPage;
