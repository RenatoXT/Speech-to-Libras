import { AbstractRouteController } from "../../../routes/abstract-route.controller";
import LibrasTranslateDao from "../Data/mongo/libras-translate.dao";
import { LibrasService } from "../Service/libras.service";


export class LibrasTranslateController extends AbstractRouteController {
    private _service: LibrasService;

    constructor() {
        super();
        this.path += "/Libras";
        this._service = new LibrasService();
        this.InitializeController();
    }

    public async InitializeController() {
        await this.InitializeGetTranslateRef();
        await this.InitializePutTranslateRef();
        await this.InitializePostTranslateRef();
        await this.InitializeDeleteTranslateRef();
    }

    public async InitializeGetTranslateRef() {
        this.router.get(
            this.path + "/sign/:name", 
            this._service.getSign).bind(this);
    }
    
    public async InitializePostTranslateRef() {
        this.router.post(
            this.path + "/new/sign",  
            this._service.uploadSign).bind(this);
    }
    
    public async InitializePutTranslateRef() {
        this.router.put(
            this.path + "/sign/:name",  
            this._service.updateSign).bind(this);
    }

    public async InitializeDeleteTranslateRef() {
        this.router.delete(
            this.path + "/sign/:name", 
            this._service.deleteSign).bind(this);
    }

}