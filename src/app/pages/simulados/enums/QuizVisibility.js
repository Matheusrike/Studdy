/**
 * Enum for Quiz Visibility states
 */
export const QuizVisibility = {
  DRAFT: 'draft',
  PUBLIC: 'public', 
  ARCHIVED: 'archived'
};

/**
 * Get display text for visibility status
 * @param {string} visibility - The visibility status
 * @returns {string} Display text
 */
export const getVisibilityText = (visibility) => {
  switch (visibility) {
    case QuizVisibility.DRAFT:
      return 'Rascunho';
    case QuizVisibility.PUBLIC:
      return 'Público';
    case QuizVisibility.ARCHIVED:
      return 'Arquivado';
    default:
      return 'Desconhecido';
  }
};

/**
 * Get color class for visibility status
 * @param {string} visibility - The visibility status
 * @returns {string} CSS color class
 */
export const getVisibilityColor = (visibility) => {
  switch (visibility) {
    case QuizVisibility.DRAFT:
      return 'text-yellow-600';
    case QuizVisibility.PUBLIC:
      return 'text-green-600';
    case QuizVisibility.ARCHIVED:
      return 'text-gray-600';
    default:
      return 'text-gray-400';
  }
};

/**
 * Get icon for visibility status
 * @param {string} visibility - The visibility status
 * @returns {string} Icon name
 */
export const getVisibilityIcon = (visibility) => {
  switch (visibility) {
    case QuizVisibility.DRAFT:
      return 'Edit';
    case QuizVisibility.PUBLIC:
      return 'Eye';
    case QuizVisibility.ARCHIVED:
      return 'Archive';
    default:
      return 'HelpCircle';
  }
};