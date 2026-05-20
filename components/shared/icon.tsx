import { type CSSProperties, type SVGAttributes } from "react";

interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, "stroke"> {
  name: string;
  size?: number;
  strokeWidth?: number;
  style?: CSSProperties;
}

export function Icon({ name, size = 18, strokeWidth = 1.6, ...rest }: IconProps) {
  const props: SVGAttributes<SVGSVGElement> = {
    width: size, height: size,
    viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth,
    strokeLinecap: "round", strokeLinejoin: "round",
    ...rest,
  };
  switch (name) {
    case "search":   return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "arrow":    return <svg {...props}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case "play":     return <svg {...props}><path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/></svg>;
    case "pause":    return <svg {...props}><rect x="6" y="5" width="4" height="14" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" fill="currentColor" stroke="none"/></svg>;
    case "star":     return <svg {...props}><path d="m12 17.3-6.18 3.7 1.64-7.03L2 9.24l7.19-.62L12 2l2.81 6.62L22 9.24l-5.46 4.73L18.18 21z" fill="currentColor" stroke="none"/></svg>;
    case "clock":    return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "users":    return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "book":     return <svg {...props}><path d="M4 4a2 2 0 0 1 2-2h13v18H6a2 2 0 0 0-2 2V4z"/><path d="M19 17H6"/></svg>;
    case "cert":     return <svg {...props}><circle cx="12" cy="9" r="6"/><path d="m8 13-1 8 5-3 5 3-1-8"/></svg>;
    case "infinity": return <svg {...props}><path d="M12 12c-2-3-4-4.5-6.5-4.5a4.5 4.5 0 0 0 0 9c2.5 0 4.5-1.5 6.5-4.5s4-4.5 6.5-4.5a4.5 4.5 0 0 1 0 9C16 16.5 14 15 12 12z"/></svg>;
    case "device":   return <svg {...props}><rect x="3" y="4" width="14" height="12" rx="2"/><path d="M2 20h13"/><rect x="17" y="9" width="5" height="11" rx="1"/></svg>;
    case "cart":     return <svg {...props}><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.5 11h11l2-8H6"/></svg>;
    case "globe":    return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case "check":    return <svg {...props}><path d="m5 12 5 5 9-11"/></svg>;
    case "x":        return <svg {...props}><path d="M6 6l12 12M18 6l-12 12"/></svg>;
    case "chev":     return <svg {...props}><path d="m6 9 6 6 6-6"/></svg>;
    case "vol":      return <svg {...props}><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M19 12a7 7 0 0 0-3-5.7M16 8a4 4 0 0 1 0 8"/></svg>;
    case "expand":   return <svg {...props}><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>;
    case "sun":      return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>;
    case "moon":     return <svg {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
    case "menu":     return <svg {...props}><path d="M3 12h18M3 6h18M3 18h18"/></svg>;
    case "dashboard":return <svg {...props}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
    case "logout":   return <svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
    case "settings": return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case "logo":     return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" {...rest}>
        <path d="M16 3c4 2 7 5 7 10s-3 8-7 10c-4-2-7-5-7-10s3-8 7-10z" fill="currentColor"/>
        <path d="M16 13v10" stroke="var(--bg)" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="16" cy="13" r="2" fill="var(--accent)"/>
      </svg>
    );
    default: return null;
  }
}
