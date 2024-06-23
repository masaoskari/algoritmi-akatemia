import { getAllContentFrontMatters } from "@/lib/mdxUtils";
import Treeview from "@/components/Treeview";

const SidePanel = () => {
  const frontMatters = getAllContentFrontMatters();
  return <Treeview frontMatters={frontMatters} />;
};

export default SidePanel;
