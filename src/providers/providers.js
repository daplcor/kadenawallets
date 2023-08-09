import xwallet, { X_WALLET } from "./xwallet"
import zelcore, { ZELCORE } from "./zelcore"
import wc, {WC} from "./wc"
// import chainweb, {CHAINWEB} from "./chainweb"

export { X_WALLET, ZELCORE, WC }

const providers = {
  X_WALLET: xwallet,
  ZELCORE: zelcore,
  WC: wc,
  // CHAINWEB: chainweb,         
}
export default providers;