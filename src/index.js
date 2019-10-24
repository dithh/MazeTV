import ShowsModel from "./ShowsModel";
import ShowsController from "./ShowsController"
import ShowsView from "./ShowsView";
import "./static/style.scss"




new ShowsController(new ShowsModel(), new ShowsView());


