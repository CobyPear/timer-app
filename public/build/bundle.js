
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /* src\App.svelte generated by Svelte v3.42.1 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let button0;

    	let t2_value = (/*$isTimeOn*/ ctx[7] && !/*$isTimeOff*/ ctx[6]
    	? 'Start time off'
    	: 'Start time on') + "";

    	let t2;
    	let t3;
    	let span1;
    	let span0;

    	let t5_value = (/*hoursOn*/ ctx[3] >= 10
    	? /*hoursOn*/ ctx[3]
    	: `0${/*hoursOn*/ ctx[3]}`) + "";

    	let t5;
    	let t6;

    	let t7_value = (/*minutesOn*/ ctx[4] >= 10
    	? /*minutesOn*/ ctx[4]
    	: `0${/*minutesOn*/ ctx[4]}`) + "";

    	let t7;
    	let t8;

    	let t9_value = (/*secondsOn*/ ctx[5] >= 10
    	? /*secondsOn*/ ctx[5]
    	: `0${/*secondsOn*/ ctx[5]}`) + "";

    	let t9;
    	let t10;
    	let br;
    	let t11;
    	let span3;
    	let span2;

    	let t13_value = (/*hoursOff*/ ctx[0] >= 10
    	? /*hoursOff*/ ctx[0]
    	: `0${/*hoursOff*/ ctx[0]}`) + "";

    	let t13;
    	let t14;

    	let t15_value = (/*minutesOff*/ ctx[1] >= 10
    	? /*minutesOff*/ ctx[1]
    	: `0${/*minutesOff*/ ctx[1]}`) + "";

    	let t15;
    	let t16;

    	let t17_value = (/*secondsOff*/ ctx[2] >= 10
    	? /*secondsOff*/ ctx[2]
    	: `0${/*secondsOff*/ ctx[2]}`) + "";

    	let t17;
    	let t18;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "on off timer";
    			t1 = space();
    			button0 = element("button");
    			t2 = text(t2_value);
    			t3 = space();
    			span1 = element("span");
    			span0 = element("span");
    			span0.textContent = "time on: ";
    			t5 = text(t5_value);
    			t6 = text(":");
    			t7 = text(t7_value);
    			t8 = text(":");
    			t9 = text(t9_value);
    			t10 = space();
    			br = element("br");
    			t11 = space();
    			span3 = element("span");
    			span2 = element("span");
    			span2.textContent = "time off: ";
    			t13 = text(t13_value);
    			t14 = text(":");
    			t15 = text(t15_value);
    			t16 = text(":");
    			t17 = text(t17_value);
    			t18 = space();
    			button1 = element("button");
    			button1.textContent = "Clear Timers";
    			attr_dev(h1, "class", "svelte-14bdl5a");
    			add_location(h1, file, 91, 2, 3092);
    			attr_dev(button0, "class", "" + (null_to_empty('start-stop-btn') + " svelte-14bdl5a"));
    			toggle_class(button0, "start", /*$isTimeOff*/ ctx[6] || !/*$isTimeOn*/ ctx[7]);
    			toggle_class(button0, "stop", /*$isTimeOn*/ ctx[7] && !/*$isTimeOff*/ ctx[6]);
    			add_location(button0, file, 92, 2, 3117);
    			attr_dev(span0, "id", "timeOn");
    			attr_dev(span0, "class", "svelte-14bdl5a");
    			add_location(span0, file, 101, 4, 3398);
    			attr_dev(span1, "class", "timer svelte-14bdl5a");
    			add_location(span1, file, 100, 2, 3372);
    			add_location(br, file, 105, 2, 3598);
    			attr_dev(span2, "id", "timeOff");
    			attr_dev(span2, "class", "svelte-14bdl5a");
    			add_location(span2, file, 107, 4, 3634);
    			attr_dev(span3, "class", "timer svelte-14bdl5a");
    			add_location(span3, file, 106, 2, 3608);
    			attr_dev(button1, "class", "clear svelte-14bdl5a");
    			add_location(button1, file, 112, 2, 3847);
    			attr_dev(main, "class", "svelte-14bdl5a");
    			add_location(main, file, 90, 0, 3082);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, button0);
    			append_dev(button0, t2);
    			append_dev(main, t3);
    			append_dev(main, span1);
    			append_dev(span1, span0);
    			append_dev(span1, t5);
    			append_dev(span1, t6);
    			append_dev(span1, t7);
    			append_dev(span1, t8);
    			append_dev(span1, t9);
    			append_dev(main, t10);
    			append_dev(main, br);
    			append_dev(main, t11);
    			append_dev(main, span3);
    			append_dev(span3, span2);
    			append_dev(span3, t13);
    			append_dev(span3, t14);
    			append_dev(span3, t15);
    			append_dev(span3, t16);
    			append_dev(span3, t17);
    			append_dev(main, t18);
    			append_dev(main, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[16], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$isTimeOn, $isTimeOff*/ 192 && t2_value !== (t2_value = (/*$isTimeOn*/ ctx[7] && !/*$isTimeOff*/ ctx[6]
    			? 'Start time off'
    			: 'Start time on') + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*$isTimeOff, $isTimeOn*/ 192) {
    				toggle_class(button0, "start", /*$isTimeOff*/ ctx[6] || !/*$isTimeOn*/ ctx[7]);
    			}

    			if (dirty & /*$isTimeOn, $isTimeOff*/ 192) {
    				toggle_class(button0, "stop", /*$isTimeOn*/ ctx[7] && !/*$isTimeOff*/ ctx[6]);
    			}

    			if (dirty & /*hoursOn*/ 8 && t5_value !== (t5_value = (/*hoursOn*/ ctx[3] >= 10
    			? /*hoursOn*/ ctx[3]
    			: `0${/*hoursOn*/ ctx[3]}`) + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*minutesOn*/ 16 && t7_value !== (t7_value = (/*minutesOn*/ ctx[4] >= 10
    			? /*minutesOn*/ ctx[4]
    			: `0${/*minutesOn*/ ctx[4]}`) + "")) set_data_dev(t7, t7_value);

    			if (dirty & /*secondsOn*/ 32 && t9_value !== (t9_value = (/*secondsOn*/ ctx[5] >= 10
    			? /*secondsOn*/ ctx[5]
    			: `0${/*secondsOn*/ ctx[5]}`) + "")) set_data_dev(t9, t9_value);

    			if (dirty & /*hoursOff*/ 1 && t13_value !== (t13_value = (/*hoursOff*/ ctx[0] >= 10
    			? /*hoursOff*/ ctx[0]
    			: `0${/*hoursOff*/ ctx[0]}`) + "")) set_data_dev(t13, t13_value);

    			if (dirty & /*minutesOff*/ 2 && t15_value !== (t15_value = (/*minutesOff*/ ctx[1] >= 10
    			? /*minutesOff*/ ctx[1]
    			: `0${/*minutesOff*/ ctx[1]}`) + "")) set_data_dev(t15, t15_value);

    			if (dirty & /*secondsOff*/ 4 && t17_value !== (t17_value = (/*secondsOff*/ ctx[2] >= 10
    			? /*secondsOff*/ ctx[2]
    			: `0${/*secondsOff*/ ctx[2]}`) + "")) set_data_dev(t17, t17_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let secondsOn;
    	let minutesOn;
    	let hoursOn;
    	let secondsOff;
    	let minutesOff;
    	let hoursOff;
    	let $timeOff;
    	let $timeOn;
    	let $isTimeOff;
    	let $isTimeOn;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	let /** @type localStorage | number*/
    	storedTimeOn = JSON.parse(localStorage.getItem('timeOn')) || 0;

    	let /** @type localStorage | number*/
    	storedTimeOff = JSON.parse(localStorage.getItem('timeOff')) || 0;

    	// time spent on
    	let /** @type Writable<number> */
    	timeOn = writable(storedTimeOn);

    	validate_store(timeOn, 'timeOn');
    	component_subscribe($$self, timeOn, value => $$invalidate(15, $timeOn = value));

    	// time spent off
    	let /** @type Writable<number> */
    	timeOff = writable(storedTimeOff);

    	validate_store(timeOff, 'timeOff');
    	component_subscribe($$self, timeOff, value => $$invalidate(14, $timeOff = value));

    	// timer state
    	let /** @type Writable<boolean> */
    	isTimeOn = writable(false);

    	validate_store(isTimeOn, 'isTimeOn');
    	component_subscribe($$self, isTimeOn, value => $$invalidate(7, $isTimeOn = value));

    	let /** @type Writable<boolean> */
    	isTimeOff = writable(false);

    	validate_store(isTimeOff, 'isTimeOff');
    	component_subscribe($$self, isTimeOff, value => $$invalidate(6, $isTimeOff = value));

    	// elapsed
    	let /** @type Writable<number> */
    	elapsed = writable(0);

    	let /** @type setInterval */
    	timerOn;

    	let /** @type setInterval */
    	timerOff;

    	/**
     * @param {string} item name of a key in localStorage
     * @param {number} value the value in which to set the item
     * @return void
     * @description at this time i am only concerned with setting numbers to local storage
     */
    	const updateLocalStorage = (item, value) => {
    		localStorage.setItem(item, value);
    	};

    	const /** @return void*/
    	incrementTimeOn = () => {
    		timeOn.update(time => time + 1);
    		updateLocalStorage('timeOn', $timeOn);
    	};

    	const /* @return void*/ incrementTimeOff = () => {
    		timeOff.update(time => time + 1);
    		updateLocalStorage('timeOff', $timeOff);
    	};

    	const startAndStopTimer = () => {
    		if (!$isTimeOn) {
    			console.log('start timerOn');
    			set_store_value(isTimeOn, $isTimeOn = !$isTimeOn, $isTimeOn);
    			console.log($isTimeOn);
    			timerOn = setInterval(incrementTimeOn, 1000);

    			if ($isTimeOff) {
    				updateLocalStorage('timeOff', $timeOff);
    				console.log('clear timerOff');
    				set_store_value(isTimeOff, $isTimeOff = !$isTimeOff, $isTimeOff);
    				clearInterval(timerOff);
    			}
    		} else if (!$isTimeOff) {
    			console.log('start timerOff');
    			set_store_value(isTimeOff, $isTimeOff = !$isTimeOff, $isTimeOff);
    			console.log($isTimeOn);
    			timerOff = setInterval(incrementTimeOff, 1000);

    			if ($isTimeOn) {
    				updateLocalStorage('timeOn', $timeOn);
    				console.log('clear timerOn');
    				set_store_value(isTimeOn, $isTimeOn = !$isTimeOn, $isTimeOn);
    				clearInterval(timerOn);
    			}
    		}
    	};

    	const clearTimers = () => {
    		console.log('stop timer');
    		console.log($isTimeOn, $isTimeOff);
    		clearInterval(timerOn);
    		clearInterval(timerOff);
    		set_store_value(isTimeOn, $isTimeOn = false, $isTimeOn);
    		set_store_value(isTimeOff, $isTimeOff = false, $isTimeOff);
    		updateLocalStorage('lastTimeOn', $timeOn);
    		updateLocalStorage('lastTimeOff', $timeOff);
    		set_store_value(timeOn, $timeOn = 0, $timeOn);
    		set_store_value(timeOff, $timeOff = 0, $timeOff);
    		updateLocalStorage('timeOn', $timeOn);
    		updateLocalStorage('timeOff', $timeOff);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => startAndStopTimer();
    	const click_handler_1 = () => clearTimers();

    	$$self.$capture_state = () => ({
    		prevent_default,
    		writable,
    		storedTimeOn,
    		storedTimeOff,
    		timeOn,
    		timeOff,
    		isTimeOn,
    		isTimeOff,
    		elapsed,
    		timerOn,
    		timerOff,
    		updateLocalStorage,
    		incrementTimeOn,
    		incrementTimeOff,
    		startAndStopTimer,
    		clearTimers,
    		hoursOff,
    		minutesOff,
    		secondsOff,
    		hoursOn,
    		minutesOn,
    		secondsOn,
    		$timeOff,
    		$timeOn,
    		$isTimeOff,
    		$isTimeOn
    	});

    	$$self.$inject_state = $$props => {
    		if ('storedTimeOn' in $$props) storedTimeOn = $$props.storedTimeOn;
    		if ('storedTimeOff' in $$props) storedTimeOff = $$props.storedTimeOff;
    		if ('timeOn' in $$props) $$invalidate(8, timeOn = $$props.timeOn);
    		if ('timeOff' in $$props) $$invalidate(9, timeOff = $$props.timeOff);
    		if ('isTimeOn' in $$props) $$invalidate(10, isTimeOn = $$props.isTimeOn);
    		if ('isTimeOff' in $$props) $$invalidate(11, isTimeOff = $$props.isTimeOff);
    		if ('elapsed' in $$props) elapsed = $$props.elapsed;
    		if ('timerOn' in $$props) timerOn = $$props.timerOn;
    		if ('timerOff' in $$props) timerOff = $$props.timerOff;
    		if ('hoursOff' in $$props) $$invalidate(0, hoursOff = $$props.hoursOff);
    		if ('minutesOff' in $$props) $$invalidate(1, minutesOff = $$props.minutesOff);
    		if ('secondsOff' in $$props) $$invalidate(2, secondsOff = $$props.secondsOff);
    		if ('hoursOn' in $$props) $$invalidate(3, hoursOn = $$props.hoursOn);
    		if ('minutesOn' in $$props) $$invalidate(4, minutesOn = $$props.minutesOn);
    		if ('secondsOn' in $$props) $$invalidate(5, secondsOn = $$props.secondsOn);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$timeOn*/ 32768) {
    			$$invalidate(5, secondsOn = ~~$timeOn % 60); /** @type number */
    		}

    		if ($$self.$$.dirty & /*$timeOn*/ 32768) {
    			$$invalidate(4, minutesOn = ~~($timeOn % 3600 / 60)); /** @type number */
    		}

    		if ($$self.$$.dirty & /*$timeOn*/ 32768) {
    			$$invalidate(3, hoursOn = ~~($timeOn / 3600)); /** @type number */
    		}

    		if ($$self.$$.dirty & /*$timeOff*/ 16384) {
    			$$invalidate(2, secondsOff = ~~$timeOff % 60); /** @type number */
    		}

    		if ($$self.$$.dirty & /*$timeOff*/ 16384) {
    			$$invalidate(1, minutesOff = ~~($timeOff % 3600 / 60)); /** @type number */
    		}

    		if ($$self.$$.dirty & /*$timeOff*/ 16384) {
    			$$invalidate(0, hoursOff = ~~($timeOff / 3600)); /** @type number */
    		}
    	};

    	return [
    		hoursOff,
    		minutesOff,
    		secondsOff,
    		hoursOn,
    		minutesOn,
    		secondsOn,
    		$isTimeOff,
    		$isTimeOn,
    		timeOn,
    		timeOff,
    		isTimeOn,
    		isTimeOff,
    		startAndStopTimer,
    		clearTimers,
    		$timeOff,
    		$timeOn,
    		click_handler,
    		click_handler_1
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
