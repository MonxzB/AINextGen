"use client";
import { Trash2 } from "lucide-react";
import { deleteTutorial } from "@/app/admin/tutorials/actions";
export function DeleteTutorialButton({id,title}:{id:string;title:string}){return <form action={deleteTutorial.bind(null,id)} onSubmit={event=>{if(!window.confirm(`Xóa tutorial “${title}”? Hành động này không thể hoàn tác.`))event.preventDefault()}}><button className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-red-600 hover:bg-red-50"><Trash2 size={15}/> Xóa</button></form>}
