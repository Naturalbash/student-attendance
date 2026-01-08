import { motion, AnimatePresence } from "framer-motion";

const CongratsModal = ({ open, projectTitle, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.85, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 30 }}
            transition={{ type: "spring", damping: 18 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              🎉 Project Completed!
            </h2>
            <p className="text-slate-600 mb-6">
              You’ve successfully completed <strong>{projectTitle}</strong>.
              Great job!
            </p>
            <button
              onClick={onClose}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default CongratsModal;
