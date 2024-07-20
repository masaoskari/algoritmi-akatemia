import { getAllContentFrontMatters } from "@/lib/mdxUtils";
import SidePanelContent from "@/components/SidePanelContent";

const SidePanel = () => {
  const frontMatters = getAllContentFrontMatters();
  return <SidePanelContent frontMatters={frontMatters} />;
};

export default SidePanel;
