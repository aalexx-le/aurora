import { APP_BAR_DATA } from "./app-bar-data";

import { AppBar as AppBarComponent } from "./app-bar";

export default function AppBar() {
    return (
        <AppBarComponent config={APP_BAR_DATA} />
    )
}
