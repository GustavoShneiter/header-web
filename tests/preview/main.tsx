import {createRoot} from "react-dom/client";
import type {AppUser} from "../../lib/app-user";
import Workspace from "../../components/workspace";
import "../../app/globals.css";
import "../../app/liquid-glass.css";
import "../../app/home-week-refinement.css";
const user={id:"qa-user",email:"teste@example.test",name:"Conta de teste",createdAt:"2026-01-01T00:00:00Z",provider:"email"} satisfies AppUser;
createRoot(document.getElementById("root")!).render(<Workspace user={user}/>);
