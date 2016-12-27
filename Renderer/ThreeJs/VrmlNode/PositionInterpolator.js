/**
 * @author Bart McLeod, mcleod@spaceweb.nl
 * @since May 25, 2016
 *
 * Adds animation and interaction support to the VrmlParser.Renderer.ThreeJs
 * @todo: take time into account
 */

/**
 * The PositionInterpolator wraps the essential properties of its original VRML node counterpart
 * and adds functionality to support animation in Three.js.
 *
 * @param originalNode
 * @constructor
 */
VrmlParser.Renderer.ThreeJs.VrmlNode[ 'PositionInterpolator' ] = function (originalNode, debug) {
	// inherit from VrmlNode
	VrmlParser.Renderer.ThreeJs.VrmlNode.apply(this, arguments);
	this.key = originalNode.key;
	this.keyValue = originalNode.keyValue;
}

VrmlParser.Renderer.ThreeJs.VrmlNode.PositionInterpolator.prototype.tween = function (target, endPosition) {
	return new TWEEN
		.Tween(target.position)
	.to(endPosition)
	.start(+ new Date())
		;
}

/**
 * Gets the animation callback method, which can play the animation associated with this OrientationInterpolator.
 * @param Object3D target
 * @param callable finish A method that will be called when the callback is ready to be removed
 */
VrmlParser.Renderer.ThreeJs.VrmlNode.PositionInterpolator.prototype.getCallback = function (target, finish) {
	var scope = this;

	// assumption that the first position is the position the target is already at, so we start with the next
	var index = 1;

	var p = this.getPosition(index);

	this.log(p);
	this.log(target);

	var tween = this.tween(target, p);

	tween.onComplete(function () {
		// take next key or finish
		index ++;

		if ( index >= scope.keyValue.length ) {
			console.log('finish');
			// now make the end position of the target exactly the same as p, to correct any rounding errors from tweening
			target.position = p;
			finish();
			return;
		}

		p = scope.getPosition(index);
		scope.log(p);
		tween            = scope.tween(target, p);
		tween.onComplete = this;
	});

	/**
	 * The animation callback
	 *
	 * @param float delta time difference
	 * @param callable finish will be called by the callback when it is ready to be removed
	 */
	var callback = function (delta) {
		tween.update(+ new Date());
	};

	return callback;
}

VrmlParser.Renderer.ThreeJs.VrmlNode.PositionInterpolator.prototype.getPosition = function (index) {
	var v = this.keyValue[ index ];
	return new THREE.Vector3(v.x, v.y, v.z);
}