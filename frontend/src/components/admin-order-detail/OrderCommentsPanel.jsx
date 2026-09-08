import React from "react";

export default function OrderCommentsPanel({
  orderDetail,
  replyValues,
  setReplyValues,
  replying,
  handleReply,
  formatDate,
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 mt-4">
      <h3 className="font-semibold text-stone-900 mb-3">Customer comments</h3>
      {orderDetail.comments && orderDetail.comments.length > 0 ? (
        <div className="space-y-3">
          {orderDetail.comments.map((c, i) => (
            <div key={i} className="p-3 rounded-lg bg-stone-50">
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm">
                  {c.user?.name || c.user || "Customer"}
                </div>
                <div className="text-xs text-stone-400">
                  {formatDate(c.createdAt)}
                </div>
              </div>
              <div className="text-sm text-stone-700 mt-1">{c.message}</div>

              {(c.replies || []).length > 0 && (
                <div className="mt-3 space-y-2 border-t border-stone-200 pt-2">
                  {c.replies.map((reply, replyIndex) => (
                    <div
                      key={`${reply.message}-${replyIndex}`}
                      className="rounded-md bg-white border border-stone-200 p-2 text-xs text-stone-700"
                    >
                      <div className="font-semibold text-stone-900">
                        {reply.user?.name ||
                          (reply.authorRole === "admin" ? "Admin" : "Customer")}
                      </div>
                      <div className="mt-1">{reply.message}</div>
                      <div className="mt-1 text-[10px] text-stone-500">
                        {formatDate(reply.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 space-y-2">
                <textarea
                  value={replyValues[c._id] || replyValues[c.id] || ""}
                  onChange={(event) =>
                    setReplyValues((prev) => ({
                      ...prev,
                      [c._id || c.id]: event.target.value,
                    }))
                  }
                  rows={2}
                  placeholder="Reply to customer"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-800 placeholder:text-stone-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleReply(c._id || c.id)}
                    disabled={
                      !(replyValues[c._id] || replyValues[c.id] || "").trim() ||
                      replying[c._id || c.id]
                    }
                    className="h-9 px-3 bg-stone-900 text-white rounded-lg text-xs font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {replying[c._id || c.id] ? "Replying..." : "Reply"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-stone-500">No comments yet.</div>
      )}
    </div>
  );
}
