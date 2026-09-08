import React, { useState } from "react";

export default function OrderTrackingCommentsSection({ order, dispatch }) {
  const [sending, setSending] = useState(false);

  return (
    <div className="mt-6 bg-white rounded-2xl border border-stone-200 p-5">
      <h3 className="text-sm font-semibold mb-3 text-stone-900">
        Comments & feedback
      </h3>

      {order.comments && order.comments.length > 0 ? (
        order.comments.map((comment, index) => (
          <div
            key={`${comment.message}-${index}`}
            className="mb-3 rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm text-stone-800"
          >
            <div className="font-semibold text-stone-900">
              {comment.user?.name || "Customer"}
            </div>
            <div className="mt-1 text-stone-700">{comment.message}</div>
            <div className="mt-2 text-[11px] text-stone-500">
              {new Date(comment.createdAt).toLocaleString()}
            </div>

            {(comment.replies || []).length > 0 && (
              <div className="mt-3 space-y-2 border-t border-stone-200 pt-2">
                {comment.replies.map((reply, replyIndex) => (
                  <div
                    key={`${reply.message}-${replyIndex}`}
                    className="rounded-md bg-white border border-stone-200 p-2 text-xs text-stone-700"
                  >
                    <div className="font-semibold text-stone-900">
                      {reply.user?.name || "Admin"}
                    </div>
                    <div className="mt-1">{reply.message}</div>
                    <div className="mt-1 text-[10px] text-stone-500">
                      {new Date(reply.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-sm text-stone-500 mb-3">No comments yet.</div>
      )}

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const data = new FormData(event.target);
          const message = data.get("message");

          if (!message || !String(message).trim() || sending) return;

          setSending(true);

          try {
            await dispatch(
              createCommentThunk({ id: order.id, message }),
            ).unwrap();
            event.target.reset();
          } catch (error) {
            console.error("Failed to post comment", error);
          } finally {
            setSending(false);
          }
        }}
        className="space-y-2"
      >
        <textarea
          name="message"
          placeholder="Describe the issue or leave feedback (e.g. delivery was late)"
          rows={3}
          disabled={sending}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-800 placeholder:text-stone-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:opacity-60"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={sending}
            className="h-10 px-4 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
