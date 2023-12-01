import xwallet, { X_WALLET } from "./xwallet"
import zelcore, { ZELCORE } from "./zelcore"
import koala, { KOALA } from "./koala"
import wc, {WC} from "./wc"
// import chainweb, {CHAINWEB} from "./chainweb"

export { X_WALLET, ZELCORE, WC, KOALA }

const providers = {
  X_WALLET: xwallet,
  ZELCORE: zelcore,
  WC: wc,
  KOALA: koala,
  // CHAINWEB: chainweb,         
}
export default providers;