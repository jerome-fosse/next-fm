import { RefObject } from "react";
import { MdErrorOutline } from "react-icons/md";

type Props = {
    message: string;
    ref: RefObject<HTMLDialogElement | null>;
};

export default function AlertDialog({ message, ref }: Props) {
    return (
        <dialog ref={ref} className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost border-none absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg text-error flex items-center gap-2">
                    <MdErrorOutline className="h-6 w-6 shrink-0" />
                    Erreur
                </h3>
                <p className="py-4 text-sm">{message}</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-error btn-soft btn-sm w-24">OK</button>
                    </form>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
}
