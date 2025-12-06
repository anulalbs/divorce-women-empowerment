import { FaUsers } from "react-icons/fa";
import { GrResources } from "react-icons/gr";
import { MdForum } from "react-icons/md";
import { TiMessages } from "react-icons/ti";
import { SiCodementor } from "react-icons/si";
import { MdDashboardCustomize } from "react-icons/md";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const { profile } = useSelector((state) => state.user);
  return (
    <aside className="sidebar">
      <ul className="list-unstyled">
        {profile && profile.role === "admin" && (<><li><a href="#"><MdDashboardCustomize /> Dashboard</a></li><li><a href="/users"><FaUsers />  Users</a></li></>)}
        <li><a href="/blogs"><GrResources /> Blog/Resources</a></li>
        <li><a href="#"><MdForum /> Community/Forum</a></li>
        <li><a href="/messages"><TiMessages /> Messages</a></li>
        <li><a href="/experts"><SiCodementor /> Experts</a></li>

      </ul>
    </aside>
  );
}
