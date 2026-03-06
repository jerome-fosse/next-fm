'use client'

import {ScrobbleReport} from "@/app/types/scrobble";

type Props = {
    report: ScrobbleReport;
};

export default function ScrobbleReportView({report}: Props) {
    const allIgnored = report.accepted === 0;
    const hasIgnored = report.ignored > 0;

    return (
        <div className="flex flex-col gap-4 my-4">
            <div className={`alert ${allIgnored ? 'alert-error' : hasIgnored ? 'alert-warning' : 'alert-success'} mt-4 mb-28`}>
                <span>
                    {report.accepted} piste{report.accepted > 1 ? 's' : ''} scrobblée{report.accepted > 1 ? 's' : ''}
                    {hasIgnored && `, ${report.ignored} ignorée${report.ignored > 1 ? 's' : ''}`}
                </span>
            </div>

            {report.scrobbles && report.scrobbles.length > 0 && (
                <div className="h-full overflow-x-auto">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th>Piste</th>
                                <th>Artiste</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.scrobbles.map((reason, i) => (
                                <tr key={i}>
                                    <td>{reason.track}</td>
                                    <td>{reason.artist}</td>
                                    <td><span className={`badge ${reason.code !== 0 ? 'badge-error' : 'badge-success'}  badge-sm`}>{reason.code}</span> {reason.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
