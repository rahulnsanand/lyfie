import { Link } from "react-router-dom";
import "./Breadcrumbs.css";

export interface BreadcrumbItem {
  name: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          const content = item.icon ?? item.name;

          return (
            <li key={item.name}>
              {!isLast && item.href ? (
                <Link to={item.href} className="breadcrumb-link">
                  {content}
                </Link>
              ) : (
                <span aria-current="page">{content}</span>
              )}

              {!isLast && <span className="separator">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
