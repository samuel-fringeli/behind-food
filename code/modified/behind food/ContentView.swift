//
//  ContentView.swift
//  behind food
//
//  Created by Samuel Fringeli on 09.09.20.
//  Copyright © 2020 Samuel Fringeli. All rights reserved.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            WebView(content: "https://adelente-admin.samf.me/app", isHtmlString: false) { (String) in
                print("url changed !")
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
