import { FaUsers } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { GrResources } from "react-icons/gr";
import { MdEmojiEvents } from "react-icons/md";
import { MdForum } from "react-icons/md";
import { TiMessages } from "react-icons/ti";
import { SiCodementor } from "react-icons/si";
import { FaHandsHelping } from "react-icons/fa";
import { IoMdAnalytics } from "react-icons/io";
import { MdDashboardCustomize } from "react-icons/md";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <ul className="list-unstyled">
        <li><a href="#"><MdDashboardCustomize/> Dashboard</a></li>
        <li><a href="/users"><FaUsers/>  Users</a></li>
        <li><a href="#"><GrResources/> Blog/Resources</a></li>
        <li><a href="#"><MdEmojiEvents/> Events</a></li>
        <li><a href="#"><MdForum/> Community/Forum</a></li>
        <li><a href="#"><TiMessages/> Messages</a></li>
        <li><a href="#"><SiCodementor/> Mentors & Coaches</a></li>
        <li><a href="#"><FaHandsHelping/> Legal Help</a></li>
        <li><a href="#"><IoMdAnalytics/> Analytics</a></li>
        <li><a href="#"><IoSettings/> Settings</a></li>
        
      </ul>
    </aside>
  );
}
