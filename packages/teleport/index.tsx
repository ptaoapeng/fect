import { Teleport, Transition, watchEffect, ref } from 'vue'
import { createNameSpace, useExpose } from '../utils'
import { props } from './props'
import './index.less'

const [createComponent] = createNameSpace('Teleport')

export default createComponent({
  props,
  emits: ['popupClick'],
  setup(props, { emit, slots }) {
    // contrl overlay dispaly

    const popupRef = ref<HTMLDivElement>()

    useExpose({ popupRef })

    // gen a mask element

    watchEffect(() => {
      const { scroll } = props
      if (scroll) return document.body.classList.add('fect--lock')
      document.body.classList.remove('fect--lock')
    })

    const clickHandler = (e: Event) => emit('popupClick', e)

    const renderOverlay = () => {
      const { overlay } = props
      if (overlay) {
        return (
          <Transition name="overlay-fade">
            <div class="fect-teleport__overlay" v-show={props.show} />
          </Transition>
        )
      }
    }

    const renderTransition = () => {
      const { transition, popupClass } = props

      return (
        <Transition name={transition}>
          <div
            v-show={props.show}
            class={popupClass}
            ref={popupRef}
            role="popup"
            onClick={clickHandler}
          >
            {slots.default?.()}
          </div>
        </Transition>
      )
    }

    return () => (
      <Teleport to={props.teleport}>
        {renderOverlay()}
        {renderTransition()}
      </Teleport>
    )
  },
})