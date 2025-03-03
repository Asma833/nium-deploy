// import { Fragment } from "react/jsx-runtime";
// import { useLocation } from "react-router-dom";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";

// export default function BreadCrumb() {
//   const location = useLocation();
//   const pathSegments = location.pathname.split('/').filter(Boolean);

//   return (
//     <div className="flex w-full pb-4 sticky top-[70px] bg-secondary z-2">
//       <Breadcrumb>
//         <BreadcrumbList>
//           <BreadcrumbItem>
//             <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
//           </BreadcrumbItem>
//           {pathSegments.map((segment, index) => {
//             const to = `/${pathSegments.slice(0, index + 1).join('/')}`;
//             const isLast = index === pathSegments.length - 1;

//             return (
//               <Fragment key={to}>
//                 <BreadcrumbSeparator />
//                 <BreadcrumbItem>
//                   {isLast ? (
//                     <BreadcrumbPage>{segment}</BreadcrumbPage>
//                   ) : (
//                     <BreadcrumbLink href={to}>
//                       {segment}
//                     </BreadcrumbLink>
//                   )}
//                 </BreadcrumbItem>
//               </Fragment>
//             );
//           })}
//         </BreadcrumbList>
//       </Breadcrumb>
//     </div>
//   );
// }
import { useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

// ✅ Function to convert kebab-case or lowercase to Title Case
const toTitleCase = (str: string) => {
  return str
    .replace(/-/g, " ") // Replace hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};

export default function BreadCrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1] || "";

  return (
    lastSegment && (
      <div className="flex w-full top-[70px]">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbPage> <span className="text-xl font-bold">{toTitleCase(lastSegment)} Page</span></BreadcrumbPage> {/* ✅ Convert to Title Case */}
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    )
  );
}
