import SwiftUI
import WebKit

protocol WebViewControllerDelegate {
    func onUrlChanged(_ url: String)
}

class WebViewCoordinator: WebViewControllerDelegate {
    let associatedWebView: WebView
    
    init(_ webView: WebView) {
        self.associatedWebView = webView
    }
    
    func onUrlChanged(_ url: String) {
        associatedWebView.onUrlChanged(url)
    }
}

struct WebView: UIViewControllerRepresentable {
    let url: URL?
    let htmlContent: String?
    let isHtmlString: Bool
    let onUrlChanged: (_ url: String) -> Void
    
    init(content: String, isHtmlString isHtmlStringParam: Bool, onUrlChanged closure: @escaping (_ url: String) -> Void) {
        self.isHtmlString = isHtmlStringParam
        if (!self.isHtmlString) {
            self.htmlContent = nil
            self.url = URL(string: content)!
        } else {
            self.url = nil
            self.htmlContent = content
        }
        self.onUrlChanged = closure
    }
    
    func updateUIViewController(_ webviewController: WebViewController, context: Context) {
        if (!self.isHtmlString) {
            let request = URLRequest(url: self.url!, cachePolicy: .returnCacheDataElseLoad)
            webviewController.webView.load(request)
        }
    }

    func makeUIViewController(context: Context) -> WebViewController {
        let controller = WebViewController(htmlContent: self.htmlContent)
        controller.delegate = context.coordinator
        return controller
    }
    
    func makeCoordinator() -> WebViewCoordinator {
        WebViewCoordinator(self)
    }
}

class WebViewController: UIViewController, WKNavigationDelegate {
    lazy var webView: WKWebView = WKWebView()
    lazy var progressbar: UIProgressView = UIProgressView()
    var delegate: WebViewControllerDelegate?
    
    convenience init(htmlContent htmlContentParam: String?) {
        self.init()
        if let htmlContent = htmlContentParam {
            webView.loadHTMLString(htmlContent, baseURL: nil)
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // add delegate to know the host
        self.webView.navigationDelegate = self
        self.webView.frame = CGRect(x: 0, y: 0, width: self.view.frame.width, height: self.view.frame.height)
        
        self.view.addSubview(self.webView)
        self.view.addSubview(self.progressbar)
        
        self.progressbar.translatesAutoresizingMaskIntoConstraints = false
        self.view.addConstraints([
            self.progressbar.topAnchor.constraint(equalTo: self.view.topAnchor),
            self.progressbar.leadingAnchor.constraint(equalTo: self.view.leadingAnchor),
            self.progressbar.trailingAnchor.constraint(equalTo: self.view.trailingAnchor),
        ])

        self.progressbar.progress = 0.1
        
        webView.addObserver(self, forKeyPath: "estimatedProgress", options: .new, context: nil)
    }
    
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        if let url = webView.url {
            delegate?.onUrlChanged("\(url)")
        }
    }

    override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
        if (keyPath == "estimatedProgress") {
            if self.webView.estimatedProgress >= 1.0 {
                UIView.animate(withDuration: 0.3, animations: { () in
                    self.progressbar.alpha = 0.0
                }, completion: { finished in
                    self.progressbar.setProgress(0.0, animated: false)
                })
            } else {
                self.progressbar.isHidden = false
                self.progressbar.alpha = 1.0
                progressbar.setProgress(Float(self.webView.estimatedProgress), animated: true)
            }
        } else {
            super.observeValue(forKeyPath: keyPath, of: object, change: change, context: context)
        }
    }
}
