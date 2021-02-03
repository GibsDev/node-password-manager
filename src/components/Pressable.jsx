import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * This component listens to its childrens events and fires press and release events accordingly. Due to the subtleties of handling events for a mouse and a touchscreen, you have to add many even listeners and keep track of state in order to determine when a press or release occurs. This component wraps itself around its children so you can specify an onPress or an onRelease event.
 * You can also specify the traditional onClick event as well.
 * 
 * @param {function} props.onPress The press function
 * @param {function} props.onRelease The release function
 * @param {function} props.onClick The traditional onClick event
 * @param {function} props.children The children passed in by react
 * @param {function} props.component The child component if using single tag format <Pressable component={foo} />
 */
const Pressable = ({ onPress, onRelease, onClick, children, component }) => {

	const [isPressed, setPressed] = useState(false);

	const onClickEvent = () => { if (onClick) onClick(); };

	const onPressEvent = () => { if (onPress) onPress(); };

	const onReleaseEvent = () => { if (onRelease) onRelease(); };

	// Called called for every event that could make isPressed > true
	const press = () => {
		if (!isPressed) {
			setPressed(true);
			onPressEvent();
		}
	};

	// Called called for every event that could make isPressed > false
	const release = () => {
		if (isPressed) {
			setPressed(false);
			onReleaseEvent();
		}
	};

	// Clones and injects the listeners into an element
	const getInjectedClone = (child) => {
		const props = {
			onClick: onClickEvent,
			onMouseDown: press,
			onMouseUp: release,
			onMouseLeave: release,
			onTouchStart: press,
			onTouchEnd: release
		};
		return React.cloneElement(child, props);
	};

	// No content inside tag
	if (!children) {
		if (!component) {
			throw new Error(`Pressable must specify a 'component' prop if empty`);
		}
		return getInjectedClone(component);
	}

	// There are no children (default to span for text)
	if (typeof children === 'string') {
		return getInjectedClone(<span>{children}</span>);
	}

	// Only one child
	if (!children.length) {
		return getInjectedClone(children);
	}

	throw new Error('Can only have one child component');
};

Pressable.propTypes = {
	children: PropTypes.node,
	component: PropTypes.node,
	onClick: PropTypes.func,
	onPress: PropTypes.func,
	onRelease: PropTypes.func
};

export default Pressable;