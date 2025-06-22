import { Property } from '../../types';

/**
 * PropertyMap component props
 * @typedef {Object} PropertyMapProps
 * @property {Property[]} properties - Array of properties to display
 * @property {function(Property): void} [onMarkerPress] - Callback when marker is pressed
 */

/**
 * Fallback PropertyMap component for platforms where it's not implemented
 * @param {PropertyMapProps} props - Component props
 * @returns {null} Returns null as fallback
 */
export default function PropertyMap(props) {
  return null;
}
