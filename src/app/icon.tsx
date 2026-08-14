import { ImageResponse } from "next/og";
export const size={width:64,height:64};
export const contentType="image/png";
export default function Icon(){return new ImageResponse(<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:16,color:"white",fontSize:24,fontWeight:900,letterSpacing:"-2px",background:"linear-gradient(135deg,#7c5cff,#22d3c5)"}}>NG</div>,size);}
