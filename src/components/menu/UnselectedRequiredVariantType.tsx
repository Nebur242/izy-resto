import { motion } from 'framer-motion';

interface IUnselectedRequiredVariantTypeProps {
  unselectedRequiredVariantType: string[];
}
export default function UnselectedRequiredVariantType(
  props: IUnselectedRequiredVariantTypeProps
) {
  const { unselectedRequiredVariantType } = props;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-900/20 mb-3"
    >
      <div className="flex items-center gap-3">
        <p className="text-amber-800 dark:text-amber-400 text-sm">
          Merci de selectionner au moins un élément parmi ces variantes
          obligatoires:{' '}
          <span className="font-bold text-amber-800 dark:text-amber-400">
            {unselectedRequiredVariantType.map((val, index) =>
              index === unselectedRequiredVariantType.length - 1
                ? val
                : `${val}, `
            )}
          </span>
        </p>
      </div>
    </motion.div>
  );
}
